# encoding=utf8

from apscheduler.schedulers.blocking import BlockingScheduler
from tasks import maintask

from rq import Queue
from worker import conn

sched = BlockingScheduler()

@sched.scheduled_job('interval', minutes=30)
def timed_for_andrewgillum():
    q = Queue(connection=conn)
    result = q.enqueue(maintask.run, timeout=500)

sched.start()
