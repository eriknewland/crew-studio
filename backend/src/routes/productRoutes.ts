import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  generateSlug,
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.post('/generate-slug', generateSlug);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);
router.put('/:slug', updateProduct);
router.delete('/:slug', deleteProduct);

export default router;
