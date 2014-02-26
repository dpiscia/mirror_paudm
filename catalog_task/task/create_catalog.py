# -*- coding: utf-8 -*-

from brownthrower import interface

class create_catalog_from_query(interface.task.Task):
    """\
    Generate a custom catalog from a user query.
    
    Build a catalog from a user query and store it on PNFS storage.
    Then, send the catalog HTTP URL to the user for its retrieval.
    """
    
    __brownthrower_name__ = "catalog.query"
    # FIXME: Remove when upgrade
    name = __brownthrower_name__
    __brownthrower_runner__ = None
    
    config_schema = """\
    {
        "type"     : "object",
        "$schema"  : "http://json-schema.org/draft-03/schema#",
        "required" : true,
        "properties":{
            "db_url": {
                "type"     : "string",
                "required" : true
            },
            "dcap_door": {
                "type"     : "string",
                "required" : true
            },
            "pnfs_path": {
                "type"     : "string",
                "required" : true
            },
            "http_url": {
                "type"     : "string",
                "required" : true
            },
            "batch_size": {
                "type"     : "integer",
                "required" : true
            },
            "format": {
                "type"     : "string",
                "required" : true
            }
        }
    }
    """
    
    input_schema = """\
    {
        "type"     : "object",
        "$schema"  : "http://json-schema.org/draft-03/schema#",
        "required" : true,
        "properties":{
            "email": {
                "type"     : "string",
                "required" : true
            },
            "sql": {
                "type"     : "string",
                "required" : true
            }
        }
    }
    """
    
    output_schema = """\
    {
        "type"     : "string",
        "$schema"  : "http://json-schema.org/draft-03/schema#",
        "required" : true
    }
    """
    
    config_sample = """\
        # Database connection URL
        db_url : postgresql://user:password@host/database
        
        # URL for gsidcap door
        dcap_door : gsidcap://gsidcap.pic.es:22128/
        
        # Store the catalogs in this PNFS path (DO NOT ADD THE LEADING SLASH)
        pnfs_path : pnfs/pic.es/data/vo.paus.pic.es/paus/disk/pub_catalog/custom/
        
        # URL for downloading this catalog
        http_url : http://catalog.astro.pic.es/download/query/123
        
        # Number of records to fetch and write at once
        batch_size : 100000
        
        # SMTP server to use when sending the notifications
        smtp_host : relay.pic.es
        
        # Format for storing the catalog on disk.
        # Valid values are: 'csv', 'ssv' and 'tsv'
        format : csv
    """
    
    input_sample = """\
        # User query to generate the custom catalog
        sql : |
            SELECT *
            FROM des_mice_v0_4_r1_4
        
        # User email to send the catalog link
        email : jorgecarreteropalacios@gmail.com
    """
    
    output_sample = """\
        # Catalog path in PNFS
        pnfs/pic.es/data/vo.paus.pic.es/paus/disk/pub_catalog/custom/123.ssv.bz2
    """
    
    def run(self, runner, inp):
        import bz2
        import csv
        import gfal2
        import hashlib
        import mailer
        import os
        import sys
        import textwrap
        import byteformat
        
        from cStringIO import StringIO
        from sqlalchemy.engine import create_engine
        
        def reraise_wrapped_gerror():
            cls, ex, tb = sys.exc_info()
            try:
                if isinstance(ex, gfal2.GError):
                    raise Exception, ex, tb
                else:
                    raise
            finally:
                del tb
        
        class CatalogWriter(object):
            def __init__(self, fh, format='csv', compression=None):
                self._fh = fh
                self._compressor = bz2.BZ2Compressor()
                self._delimiter = {
                    'csv' : ',',
                    'ssv' : ' ',
                    'tsv' : '\t',
                }[format]
            
            def write(self, rows):
                out = StringIO()
                w = csv.writer(out, delimiter=self._delimiter)
                w.writerows(rows)
                data = self._compressor.compress(out.getvalue())
                if data:
                    self._fh.write(data)
                return len(data)
            
            def close(self):
                data = self._compressor.flush()
                if data:
                    self._fh.write(data)
                self._fh = None
                return len(data)
        
        # Open file in the pnfs using gfal
        filename = '{name}.{format}.{extension}'.format(
            name      = str(runner.job_id),
            format    = self.config['format'],
            extension = 'bz2',
        )
        pnfs_file = os.path.join(self.config['dcap_door'], self.config['pnfs_path'], filename)
        mc = gfal2.creat_context()
        
        try:
            fd_pnfs = mc.open(pnfs_file, "w")
            
            # Connect to DB and execute query
            engine = create_engine(
                self.config['db_url'],
                execution_options = { 'stream_results' : True }
            )
            rs = engine.execute(inp['sql'])
            
            # Create CatalogWrite and write header
            catalog = CatalogWriter(fd_pnfs, format=self.config['format'])
            catalog.write([rs.keys()])
            
            size = 0
            n_rows = 0
            while True:
                rows = rs.fetchmany(self.config['batch_size'])
                if not rows:
                    break
                size += catalog.write(rows)
                n_rows += len(rows)
            
            size += catalog.close()
            del fd_pnfs
            
            # Send an Email with file link
            file_url = self.config['http_url']
            
            # TODO: Use templates
            # TODO: Use transaction
            message = mailer.Message(
                From    = "Simulations portal at PIC <do-not-reply@pic.es>",
                To      = [inp['email']],
                Subject = "Your catalog is available for download",
                Body    = textwrap.dedent("""\
                    Hello,
                    your catalog request has been produced and it is already available at the link provided below.
                    Before the download starts, you may be redirected to the login page to validate your credentials.
                    
                    {link}
                    
                    Your catalog has been generated using the following query:
                    
                    {query}
                    
                    The number of objects in the catalog is {count} and the size of the compressed file is {filesize}
                    
                    Regards,
                    MICE@PIC.
                    """).format(
                        link = file_url,
                        query=inp['sql'],
                        count=n_rows,
                        filesize=byteformat.format(size, scheme='BINARY')
                    )
                )
            
            
            sender = mailer.Mailer(self.config['smtp_host'])
            sender.send(message)
            
            return os.path.join(self.config['pnfs_path'], filename)
        
        except:
            try:
                reraise_wrapped_gerror()
            finally:
                try:
                    mc.unlink(pnfs_file) # Protocol not supported :(
                except:
                    try:
                        reraise_wrapped_gerror()
                    except Exception:
                        pass

if __name__ == '__main__':
    import yaml
    
    t = create_catalog_from_query(
        yaml.safe_load(create_catalog_from_query.config_sample)
    )
    
    t.run(None, yaml.safe_load(create_catalog_from_query.input_sample))
