
import rasterio

def get_population_density(geo_tiff_path, latitude, longitude):
    """
    Retrieve the population density at a specific latitude and longitude from a GeoTIFF file.
    
    Parameters:
        geo_tiff_path (str): Path to the population density GeoTIFF file.
        latitude (float): Latitude of the location.
        longitude (float): Longitude of the location.
    
    Returns:
        float: Population density at the given location, or None if the location is outside the raster bounds.
    """
    try:
        # Open the GeoTIFF file
        with rasterio.open(geo_tiff_path) as dataset:
            
            # Check if coordinates are within bounds
            if not (dataset.bounds.left <= longitude <= dataset.bounds.right and
                    dataset.bounds.bottom <= latitude <= dataset.bounds.top):
                print("The specified location is outside the bounds of the population density data.")
                return None
            
            # Convert latitude and longitude to dataset pixel coordinates
            row, col = dataset.index(longitude, latitude)
            
            # Read the population density value at the pixel
            pop_density = dataset.read(1)[row, col]
            return pop_density

    except rasterio.errors.RasterioIOError:
        print(f"Error: Unable to open GeoTIFF file at {geo_tiff_path}. Ensure the file path is correct.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    

