#! /usr/bin/env python
# -*- coding: utf-8 -*-

import brownthrower.model
import hashlib
import yaml

from brownthrower.interface import constants
from contextlib import contextmanager
from sqlalchemy.engine import reflection #@UnusedImport
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import eagerload, relationship
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound #@UnusedImport
from sqlalchemy.schema import Column
from sqlalchemy.schema import ForeignKeyConstraint, PrimaryKeyConstraint, UniqueConstraint
from sqlalchemy.sql.expression import and_
from sqlalchemy.types import BigInteger, Boolean, Date, Integer, String

settings = {}

Base = brownthrower.model.Base

class User(Base):
    __tablename__ = 'user'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('id'),
        # Unique key
        UniqueConstraint('email'),
    )
    
    # Columns
    id        = Column(Integer,     nullable=False)
    email     = Column(String(40),  nullable=False)
    name      = Column(String(40),  nullable=False)
    _password = Column(String(128), nullable=False, name='password')
    enabled   = Column(Boolean,     nullable=False, default=False)
    is_admin  = Column(Boolean,     nullable=False, default=False)
    
    # Relationships
    groups  = relationship('Group', back_populates='users', collection_class=set, secondary=lambda: ACL.__table__)
    queries = relationship('Query', back_populates='user',  collection_class=set, secondary=lambda: UserQuery.__table__)
    
    # Additional relationships
    ongoing_queries = relationship('Query', secondary=lambda: UserQuery.__table__, collection_class=set,
        secondaryjoin = lambda: and_(
            UserQuery.job_id == Query.id,
            Query.status.in_([
                constants.JobStatus.QUEUED,
                constants.JobStatus.PROCESSING,
            ])
        )
    )
    
    @hybrid_property
    def password(self):
        return self._password
    
    @password.setter
    def password(self, password):
        self._password = hashlib.sha512(
            password + settings['password.salt']
        ).hexdigest()
    
    def check_password(self, password ):
        return self._password == hashlib.sha512(
            password + settings['password.salt']
        ).hexdigest()
    
    def __repr__(self):
        return u"%s(id=%s, email=%s, name=%s, enabled=%s, is_admin=%s)" % (
            self.__class__.__name__,
            repr(self.id),
            repr(self.email),
            repr(self.name),
            repr(self.enabled),
            repr(self.is_admin),
        )

class Group(Base):
    __tablename__ = 'group'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('id'),
        # Unique key
        UniqueConstraint('name'),
    )
    
    # Columns
    id   = Column(Integer,    nullable=False)
    name = Column(String(20), nullable=False)
    password = Column(String(40), nullable=False)
    
    # Relationships
    users    = relationship('User',    back_populates='groups', collection_class=set, secondary=lambda: ACL.__table__)
    catalogs = relationship('Catalog', back_populates='groups', collection_class=set, secondary=lambda: GroupCatalog.__table__)
    
    def __repr__(self):
        return u"%s(id=%s, name=%s)" % (
            self.__class__.__name__,
            repr(self.id),
            repr(self.name),
        )

class ACL(Base):
    __tablename__ = 'acl'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('user_id', 'group_id'),
        # Foreign keys
        ForeignKeyConstraint(['user_id'],  [User.id],  onupdate='CASCADE', ondelete='CASCADE'),
        ForeignKeyConstraint(['group_id'], [Group.id], onupdate='CASCADE', ondelete='CASCADE'),
    )
    
    # Columns
    user_id  = Column(Integer, nullable=False)
    group_id = Column(Integer, nullable=False)

    # Relationships
    user  = relationship('User')
    group = relationship('Group')
    
    def __repr__(self):
        return u"%s(user_id=%s, group_id=%s)" % (
            self.__class__.__name__,
            repr(self.user_id),
            repr(self.group_id),
        )

class Query(brownthrower.model.Job):
    # Relationships
    user = relationship('User', back_populates='queries', secondary=lambda: UserQuery.__table__, uselist=False)
    
    @contextmanager
    def as_dict(self, column):
        if not getattr(self, column):
            dict_ = {}
        else:
            dict_ = yaml.safe_load(getattr(self, column))
        yield dict_
        setattr(self, column, yaml.safe_dump(dict_, default_flow_style=False))
    
    @property
    def path(self):
        return yaml.safe_load(self.output)
    
    @property
    def email(self):
        with self.as_dict('input') as inp:
            return inp.get('email', None)
    
    @email.setter
    def email(self, email):
        with self.as_dict('input') as inp:
            inp['email'] = email
    
    @property
    def sql(self):
        with self.as_dict('input') as inp:
            return inp.get('sql', None)
    
    @sql.setter
    def sql(self, sql):
        with self.as_dict('input') as inp:
            inp['sql'] = sql
    
    def __repr__(self):
        return u"%s(id=%s, status=%s, email=%s, sql=%s)" % (
            self.__class__.__name__,
            repr(self.id),
            repr(self.status),
            repr(self.email),
            repr(self.sql),
        )

class Catalog(Base):
    __tablename__ = 'catalog'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('id'),
        # Unique keys
        UniqueConstraint('name'),
    )
    
    # Columns
    id          = Column(Integer,      nullable=False)
    name        = Column(String(20),   nullable=False)
    description = Column(String(1000), nullable=True)
    table       = Column(String(40),   nullable=False)
    view        = Column(String(40),   nullable=True)
    version     = Column(String(10),   nullable=False)
    date        = Column(Date,         nullable=False)
    
    # Relationships
    groups    = relationship('Group',    back_populates='catalogs', collection_class=set, secondary=lambda: GroupCatalog.__table__)
    prebuilts = relationship('Prebuilt', back_populates='catalog',  collection_class=set)
    
    @property
    def from_clause(self):
        if self.view:
            return self.view
        return self.table
    
    def __repr__(self):
        return u"%s(id=%s, name=%s, table=%s, view=%s, version=%s, date=%s)" % (
            self.__class__.__name__,
            repr(self.id),
            repr(self.name),
            repr(self.table),
            repr(self.view),
            repr(self.version),
            repr(self.date),
        )

class UserQuery(Base):
    __tablename__ = 'query'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('job_id'),
        # Unique keys
        UniqueConstraint('user_id', 'job_id'),
        # Foreign keys
        ForeignKeyConstraint(['job_id'],  [Query.id], onupdate='CASCADE', ondelete='CASCADE'),
        ForeignKeyConstraint(['user_id'], [User.id],  onupdate='CASCADE', ondelete='CASCADE'),
    )
    
    # Columns
    job_id  = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    
    # Relationships
    query = relationship('Query')
    user  = relationship('User')
    
    def __repr__(self):
        return u"%s(job_id=%s, user_id=%s)" % (
            self.__class__.__name__,
            repr(self.job_id),
            repr(self.user_id),
        )

class GroupCatalog(Base):
    __tablename__ = 'group_catalog'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('group_id', 'catalog_id'),
        # Foreign keys
        ForeignKeyConstraint(['group_id'],   [Group.id],   onupdate='CASCADE', ondelete='CASCADE'),
        ForeignKeyConstraint(['catalog_id'], [Catalog.id], onupdate='CASCADE', ondelete='CASCADE'),
    )
    
    # Columns
    group_id   = Column(Integer, nullable=False)
    catalog_id = Column(Integer, nullable=False)
    
    # Relationships
    group   = relationship('Group')
    catalog = relationship('Catalog')
    
    def __repr__(self):
        return u"%s(group_id=%s, catalog_id=%s)" % (
            self.__class__.__name__,
            repr(self.group_id),
            repr(self.catalog_id),
        )

class Prebuilt(Base):
    __tablename__ = 'prebuilt'
    __table_args__ = (
        # Primary key
        PrimaryKeyConstraint('id'),
        # Foreign keys
        ForeignKeyConstraint(['catalog_id'], [Catalog.id], onupdate='CASCADE', ondelete='CASCADE'),
    )
    
    # Columns
    id           = Column(Integer,     nullable=False)
    catalog_id   = Column(Integer,     nullable=False)
    name         = Column(String(20),  nullable=False)
    description  = Column(String(200), nullable=True)
    size         = Column(BigInteger,  nullable=False)
    path_catalog = Column(String(200), nullable=False)
    path_readme  = Column(String(200), nullable=False)
    
    # Relationships
    catalog = relationship('Catalog', back_populates='prebuilts')
    