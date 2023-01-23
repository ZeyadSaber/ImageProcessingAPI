# ImageProcessingAPI

this project mainly took image name, width and height then returns resize image if its name exists.
then save it for caching (returned if requested again).

endpoints :
'/'
'/api/images?file_name=X&width=X&height=X'

sharp was used to resize images.
jasmine was used for testing.
