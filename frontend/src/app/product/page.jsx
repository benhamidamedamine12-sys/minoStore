import { Suspense } from 'react';
import ProductList from './Product';

export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductList />
    </Suspense>
  );
}
