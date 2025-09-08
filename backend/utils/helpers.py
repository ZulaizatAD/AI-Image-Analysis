import base64


def encode_image(image_content: bytes) -> str:
    """Encode image content to base64"""
    return base64.b64encode(image_content).decode()


def validate_file_type(content_type: str) -> bool:
    """Validate if file type is allowed"""
    from config.settings import settings

    return content_type in settings.ALLOWED_FILE_TYPES


def validate_file_size(file_size: int) -> bool:
    """Validate if file size is within limits"""
    from config.settings import settings

    return file_size <= settings.MAX_FILE_SIZE
