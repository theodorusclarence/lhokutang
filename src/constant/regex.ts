export const REGEX = {
  EMAIL: {
    value:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: 'Email tidak valid',
  },
  PHONE_NUMBER: {
    value: /^\+628[1-9][0-9]{7,11}$/,
    message:
      'Nomor Telepon harus diawali +62 dan memiliki panjang 13-15 karakter',
  },
};
