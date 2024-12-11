from anonymisation import randlonglat
from get_population_density import get_population_density

def randlonglat2(lat,lon,geo_tiff_path,k):
    """
    Generate a random coordinate to serve as the center of a circle (where the radius 
    is inversely proportional to population density at that point) containing the original (latitude, longitude).
    
    Parameters:
        lat (float): Latitude of the original point.
        lon (float): Longitude of the original point.
        geo_tiff_path (str): Path to the population density GeoTIFF file.
        k (float): 
    
    Returns:
        dict: A dictionary containing the new center's latitude and longitude.
        radius_meters (float): Radius in meters for the circle.
    """
    density = get_population_density(geo_tiff_path,lat,lon)
    radius = k/density 
    return(randlonglat(lat,lon,radius),radius)



    

