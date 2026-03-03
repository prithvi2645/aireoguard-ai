import sys
print(sys.executable)
try:
    import pandas
    print("Pandas imported successfully")
    print(pandas.__version__)
except ImportError as e:
    print(f"Error: {e}")
