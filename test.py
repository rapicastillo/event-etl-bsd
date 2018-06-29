# from etl.indivisible import main as indivisible
#
# try:
#     indivisible.run()
# except ValueError as error:
#     print('Caught this error: ' + repr(error))

from tasks import maintask

maintask.run()
