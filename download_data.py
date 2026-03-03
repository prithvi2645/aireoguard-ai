import urllib.request
import zipfile
import os

url = "https://data.nasa.gov/docs/legacy/CMAPSSData.zip"
zip_path = "data/CMAPSSData.zip"
extract_path = "data/"

if not os.path.exists("data"):
    os.makedirs("data")

print(f"Downloading from {url}...")
urllib.request.urlretrieve(url, zip_path)
print("Download complete.")

print("Extracting...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)
print("Extraction complete.")
