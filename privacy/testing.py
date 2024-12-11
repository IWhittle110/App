from anonymisation import randlonglat
from get_population_density import get_population_density
from anonymisation2 import randlonglat2

# Test randlonglat
bath_uni = randlonglat(51.3782,-2.3264, 1000)  # Bath Uni, 1000 meter radius
print(bath_uni)

# Test get_population_density
# Example GeoTIFF Path 
geo_tiff_path = r"privacy\gbr_pd_2020_1km.tif"

# Example coordinates (Latitude and Longitude) Bath Uni
latitude = 51.3782 
longitude = -2.3264

# Get population density
pop_density = get_population_density(geo_tiff_path, latitude, longitude)

if pop_density is not None:
    print(f"Population density at ({latitude}, {longitude}): {pop_density} people per square km")
else:
    print("Population density could not be retrieved.")
    
# Test randlonglat2
const = 1000000

bath_uni = randlonglat2(latitude,longitude,geo_tiff_path,const)  
print("new coordinates are (" , bath_uni[0][0],",",bath_uni[0][1] , ") with radius", bath_uni[1], "metres")