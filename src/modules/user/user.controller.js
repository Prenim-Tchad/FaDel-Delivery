import { authenticateUser, createUser } from './user.service.js';

const register = async (req, res) => {
  try {
    const result = await createUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Email ou telephone deja utilise.' });
    }
    return res.status(501).json({ message: "Erreur serveur lors de l'inscription.", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const authData = await authenticateUser(req.body.email, req.body.motDePasse);
    if (!authData) return res.status(401).json({ message: 'Identifiants incorrects.' });
    return res.status(200).json(authData);
  } catch {
    return res.status(501).json({ message: 'Erreur lors de la connexion.' });
  }
};

export default { register, login };
