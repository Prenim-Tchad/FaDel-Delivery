import { createProduct, getAllProducts, updateStock } from './product.service.js';

const create = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(501).json({ message: 'Erreur lors de la creation du produit.', error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const products = await getAllProducts(req.query);
    res.status(200).json(products);
  } catch {
    res.status(501).json({ message: 'Impossible de charger le catalogue.' });
  }
};

const updateStockController = async (req, res) => {
  try {
    const product = await updateStock(req.params.id, req.body.stockFull);
    res.status(200).json(product);
  } catch {
    res.status(400).json({ message: 'Erreur lors de la mise a jour du stock.' });
  }
};

export default { create, list, updateStock: updateStockController };
