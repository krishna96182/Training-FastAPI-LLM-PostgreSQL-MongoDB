from fastapi import FastAPI, status, Response, APIRouter, Depends
from enum import Enum
from typing import Optional
from router.blog_post import required_functionality

router = APIRouter(
    prefix='/blog',
    tags=['blog']
)

# @app.get('/blog/all')
# def get_all_blog():
#     return {'message': 'All blogs provided'}

# #Default Values
# @app.get('/blog/all')
# def get_all_blogs(page = 1, page_size = 10):
#     return {'message': f'All {page_size} blogs on page {page}'}

# #Optional parameters
# @app.get('/blog/all')
# def get_all_blogs(page = 1, page_size: Optional[int] = None):
#     return {'message': f'All {page_size} blogs on page {page}'}

#Tags
@router.get(
    '/all',
    summary='Retrive all blogs',
    description='This api call simulates fetching all blogs.',
    response_description='The list of avaliable blogs'
    )
def get_all_blogs(page = 1, page_size: Optional[int] = None, req_parameter: dict = Depends(required_functionality)):
    return {'message': f'All {page_size} blogs on page {page}', 'req': req_parameter}

@router.get('/{id}/comments/{comment_id}', tags=['comment'])
def get_comment(id: int, comment_id: int, valid: bool=True, username: Optional[str]=None, req_parameter: dict = Depends(required_functionality)):
    """
    Simulates retrieving a comment of a blog
    
    - **id** mandatory path parameter
    - **comment_id** mandatory path parameter
    - **valid** optional query parameter
    - **username** optional query parameter
    """
    return {'message': f'blog_id {id}, comment_id {comment_id}, valid {valid}, username: {username}'}


# #Path and Query Parameters
# @app.get('/blog/{id}/comments/{comment_id}')
# def get_comment(id: int, comment_id: int, valid: bool=True, username: Optional[str]=None):
#     return {'message': f'blog_id {id}, comment_id {comment_id}, valid {valid}, username: {username}'}

class BlogType(str, Enum):
    short= 'short'
    story= 'story'
    howto= 'howto'
    
@router.get('/type/{type}')
def get_blog_type(type: BlogType, req_parameter: dict = Depends(required_functionality)):
    return {'message': f'Blog type {type}'}

#Change the status code
# @app.get('/blog/{id}', status_code=status.HTTP_404_NOT_FOUND)
# def get_blog(id: int):
#     if id > 5:
#         return {'error': f'Blog {id} not found'}
#     else:
#         return {'meaage': f'Blog with id {id}'}


#Change the status code on the response
@router.get('/{id}', status_code=status.HTTP_200_OK)
def get_blog(id: int, response: Response, req_parameter: dict = Depends(required_functionality)):
    if id > 5:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {'error': f'Blog {id} not found'}
    else:
        response.status_code = status.HTTP_200_OK
        return {'meaage': f'Blog with id {id}'}