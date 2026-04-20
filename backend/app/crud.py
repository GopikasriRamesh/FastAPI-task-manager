from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_tasks(db: Session, user_id: int, completed: bool = None, skip: int = 0, limit: int = 10):
    query = db.query(models.Task).filter(models.Task.owner_id == user_id)
    if completed is not None:
        query = query.filter(models.Task.completed == completed)
    return query.offset(skip).limit(limit).all()

def create_user_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate, user_id: int):

    db_task = db.query(models.Task).filter(
        models.Task.id == task_id, 
        models.Task.owner_id == user_id
    ).first()
    
    if db_task:
        update_data = task_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_task, key, value)
        
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):

    db_task = db.query(models.Task).filter(
        models.Task.id == task_id, 
        models.Task.owner_id == user_id
    ).first()
    
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False