import { BadRequestException } from '@nestjs/common';

export function isValidUUID(str: string) {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
}

export function validationID(id: string) {
  if (!isValidUUID(id)) {
    throw new BadRequestException('Invalid ID');
  }
}
