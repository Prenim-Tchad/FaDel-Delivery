import {
  getCurrentUser,
  loginUser,
  registerUser,
  resendVerificationCode,
  verifyEmailCode,
} from './auth.service.js';

const handleError = (res, error) => {
  const statusCode = error.statusCode ?? 500;
  const payload = { message: error.message };

  if (error.extra) {
    Object.assign(payload, error.extra);
  }

  if (statusCode === 500) {
    console.error(error);
  }

  return res.status(statusCode).json(payload);
};



const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmailCode(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

const resendCode = async (req, res) => {
  try {
    const result = await resendVerificationCode(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
};

const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return handleError(res, error);
  }
};

export default { login, me, register, resendCode, verifyEmail };
