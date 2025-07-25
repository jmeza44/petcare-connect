import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMappingService {
  private errorMessages: Record<string, string> = {
    // User-related errors
    USER_EMAIL_NOT_CONFIRMED:
      'El correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada. Puedes solicitar un nuevo enlace de confirmación haciendo clic al botón en pantalla.',
    USER_EMAIL_ALREADY_EXISTS:
      'Ya existe una cuenta asociada a este correo electrónico. Si no recuerdas tu contraseña, puedes intentar recuperarla.',
    USER_ALREADY_EXISTS:
      'Ya existe una cuenta asociada a este correo electrónico. Si no recuerdas tu contraseña, puedes intentar recuperarla.',
    WEAK_PASSWORD:
      'La contraseña proporcionada es demasiado débil. Asegúrate de usar una contraseña más fuerte, que contenga al menos una letra mayúscula, un número y un carácter especial.',
    INVALID_USER_DATA:
      'Algunos datos del usuario son incorrectos o faltan. Asegúrate de haber completado todos los campos obligatorios correctamente.',
    USER_CREATION_FAILED:
      'No se pudo crear el usuario debido a un error. Por favor, inténtalo de nuevo o contacta con soporte.',
    INVALID_EMAIL_CONFIRMATION:
      'El enlace de confirmación del correo electrónico es inválido o ha expirado. Por favor, solicita un nuevo enlace de confirmación.',
    EMAIL_ALREADY_CONFIRMED:
      'El correo electrónico ya ha sido confirmado. Si tienes problemas para acceder, por favor revisa tus credenciales o contacta con soporte.',
    PASSWORD_CHANGE_FAILED:
      'No se pudo cambiar la contraseña. Asegúrate de haber introducido la contraseña actual correctamente.',
    USER_DELETION_FAILED:
      'No se pudo eliminar el usuario. Por favor, intenta nuevamente o contacta con soporte.',
    PASSWORD_RESET_FAILED:
      'No se pudo restablecer la contraseña. Asegúrate de que el enlace de restablecimiento no haya expirado y vuelve a intentarlo.',
    USER_OPERATION_FAILED:
      'La operación del usuario falló. Por favor, intenta nuevamente más tarde.',
    // Authentication and authorization errors
    LOGIN_FAILED:
      'Error desconocido al intentar iniciar sesión. Por favor, intenta nuevamente más tarde o contacta con soporte.',
    INVALID_CREDENTIALS:
      'Las credenciales proporcionadas son incorrectas. Verifica tu correo electrónico y contraseña, y vuelve a intentarlo.',
    AUTH_EMAIL_NOT_CONFIRMED:
      'El correo electrónico no ha sido confirmado. Por favor, revisa tu bandeja de entrada. Puedes solicitar un nuevo enlace de confirmación.',
    USER_NOT_FOUND:
      'No se ha encontrado un usuario con el correo electrónico proporcionado. Verifique que haya ingresado correctamente el correo electrónico y vuelva a intentarlo.',
    UNAUTHORIZED_EXCEPTION:
      'No tienes permiso para realizar esta acción. Asegúrate de que estás autenticado y tienes los permisos necesarios.',
    // File-related errors
    FILE_TOO_LARGE:
      'El archivo es demasiado grande. Por favor, selecciona un archivo más pequeño.',
    EMPTY_FILE:
      'El archivo está vacío. Por favor, selecciona un archivo válido.',
    UNSUPPORTED_FILE_TYPE:
      'El tipo de archivo no es compatible. Por favor, selecciona un archivo con un tipo válido.',
  };

  private readonly statusToNotification: Record<
    number,
    'success' | 'error' | 'info' | 'warning'
  > = {
    400: 'warning', // Bad Request – validation or user input issues
    401: 'warning', // Unauthorized – login required or token expired
    403: 'error', // Forbidden – authenticated but lacking permission
    404: 'warning', // Not Found – resource does not exist
    409: 'error', // Conflict – email already exists, etc.
    422: 'warning', // Unprocessable Entity – semantic errors in input
    429: 'warning', // Too Many Requests – rate limit hit
    500: 'error', // Internal Server Error – unexpected backend error
    503: 'error', // Service Unavailable – temporary downtime
  };

  getMessage(errorCode: string): string | null {
    return this.errorMessages[errorCode] || null;
  }

  getNotificationMethod(
    status: number,
  ): 'success' | 'error' | 'info' | 'warning' {
    return this.statusToNotification[status] || 'error'; // Default fallback
  }
}
