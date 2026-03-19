import traceback
try:
    import app.main
    print('Success')
except Exception as e:
    with open('error_log.txt', 'w') as f:
        f.write(traceback.format_exc())
