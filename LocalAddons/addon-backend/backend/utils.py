import base64

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


class AESCrypto:
    def __init__(self, key: str) -> None:
        self.aes_key = key.encode()

    def encrypt_using_aes(self, plain_text: str) -> str:
        cipher = Cipher(
            algorithms.AES(self.aes_key), modes.ECB(), backend=default_backend()
        )
        encryptor = cipher.encryptor()
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(plain_text.encode()) + padder.finalize()
        encrypted = encryptor.update(padded_data) + encryptor.finalize()
        return base64.b64encode(encrypted).decode("utf-8")

    def decrypt_using_aes(self, encrypted_base64: str) -> str:
        encrypted_bytes = base64.b64decode(encrypted_base64)
        cipher = Cipher(
            algorithms.AES(self.aes_key), modes.ECB(), backend=default_backend()
        )
        decryptor = cipher.decryptor()
        decrypted_padded = decryptor.update(encrypted_bytes) + decryptor.finalize()
        unpadder = padding.PKCS7(128).unpadder()
        decrypted_data = unpadder.update(decrypted_padded) + unpadder.finalize()
        return decrypted_data.decode("utf-8")
