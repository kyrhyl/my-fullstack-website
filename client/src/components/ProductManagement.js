import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const ProductManagementContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddProductButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #229954;
  }
`;

const ProductsTable = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1fr 1fr 120px;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: bold;
  border-bottom: 1px solid #eee;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 1fr 1fr 120px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 3px;
  margin-right: 0.25rem;
  
  &.edit {
    color: #3498db;
    
    &:hover {
      background: #e3f2fd;
    }
  }
  
  &.delete {
    color: #e74c3c;
    
    &:hover {
      background: #ffebee;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  
  &.primary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &.secondary {
    background: #95a5a6;
    color: white;
    
    &:hover {
      background: #7f8c8d;
    }
  }
  
  &.danger {
    background: #e74c3c;
    color: white;
    
    &:hover {
      background: #c0392b;
    }
  }
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'electronics',
    stock: '',
    brand: '',
    images: ['https://via.placeholder.com/300x200?text=Product+Image'],
    sku: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      // Use the same base URL logic as other components
      const baseURL = process.env.NODE_ENV === 'production' 
        ? '' // In production, API calls go to the same domain
        : 'http://localhost:5001'; // In development, use localhost:5001
      
      const response = await fetch(`${baseURL}/api/admin/products`, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price === '' || formData.stock === '') {
      toast.error('Please fill in all required fields: Name, Description, Price, and Stock');
      return;
    }
    
    try {
      // Use the same base URL logic as other components
      const baseURL = process.env.NODE_ENV === 'production' 
        ? '' // In production, API calls go to the same domain
        : 'http://localhost:5001'; // In development, use localhost:5001
      
      const url = editingProduct 
        ? `${baseURL}/api/admin/products/${editingProduct._id || editingProduct.id}`
        : `${baseURL}/api/admin/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
          console.log(`Adding field ${key}:`, formData[key]);
        }
      });
      
      // Add files
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
        console.log('Adding file:', file.name);
      });
      
      console.log('Sending product data with files:', selectedFiles.length, 'files');
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Product saved successfully:', result);
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        console.error('Server error response:', error);
        toast.error(error.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!productId) {
      toast.error('Invalid product ID');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      // Use the same base URL logic as other components
      const baseURL = process.env.NODE_ENV === 'production' 
        ? '' // In production, API calls go to the same domain
        : 'http://localhost:5001'; // In development, use localhost:5001
      
      const response = await fetch(`${baseURL}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      
      if (response.ok) {
        toast.success('Product deleted successfully!');
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    if (!product || !product._id) {
      toast.error('Invalid product data');
      return;
    }
    
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: (product.price || 0).toString(),
      category: product.category || 'electronics',
      stock: (product.stock || 0).toString(),
      brand: product.brand || '',
      images: product.images || ['https://via.placeholder.com/300x200?text=Product+Image'],
      sku: product.sku || ''
    });
    setSelectedFiles([]);
    setImagePreview([]);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setImagePreview(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'electronics',
      stock: '',
      brand: '',
      images: ['https://via.placeholder.com/300x200?text=Product+Image'],
      sku: ''
    });
    setSelectedFiles([]);
    setImagePreview([]);
  };

  if (loading) {
    return (
      <ProductManagementContainer>
        <div className="spinner"></div>
      </ProductManagementContainer>
    );
  }

  return (
    <ProductManagementContainer>
      <Header>
        <h2>Product Management</h2>
        <AddProductButton onClick={handleAdd}>
          <FaPlus />
          Add Product
        </AddProductButton>
      </Header>

      <ProductsTable>
        <TableHeader>
          <div>Image</div>
          <div>Name</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Category</div>
          <div>Actions</div>
        </TableHeader>
        
        {products.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
            <p>No products found. Add your first product!</p>
          </div>
        ) : (
          products.map(product => (
            <TableRow key={product._id || product.id}>
              <ProductImage 
                src={getImageUrl(product.images?.[0])} 
                alt={product.name || 'Product'} 
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  console.log('Product images:', product.images);
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', getImageUrl(product.images?.[0]));
                }}
              />
              <div>{product.name || 'Unnamed Product'}</div>
              <div>${product.price || 0}</div>
              <div>{product.stock || 0}</div>
              <div>{product.category || 'Uncategorized'}</div>
              <div>
                <ActionButton 
                  className="edit" 
                  onClick={() => handleEdit(product)}
                  title="Edit"
                >
                  <FaEdit />
                </ActionButton>
                <ActionButton 
                  className="delete" 
                  onClick={() => handleDelete(product._id || product.id)}
                  title="Delete"
                >
                  <FaTrash />
                </ActionButton>
              </div>
            </TableRow>
          ))
        )}
      </ProductsTable>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Product Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home</option>
                  <option value="sports">Sports</option>
                  <option value="beauty">Beauty</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Brand</Label>
                <Input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                />
              </FormGroup>

              <FormGroup>
                <Label>Product Images (Max 5 images, 5MB each)</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ padding: '0.5rem' }}
                />
                <small style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>
                  Supported formats: JPG, PNG, GIF. Leave empty to use placeholder image.
                </small>
                {imagePreview.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <Label>Image Previews:</Label>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {imagePreview.map((preview, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            style={{ 
                              width: '80px', 
                              height: '80px', 
                              objectFit: 'cover',
                              borderRadius: '5px',
                              border: '1px solid #ddd'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: '-5px',
                              right: '-5px',
                              background: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormGroup>

              <FormGroup>
                <Label>SKU (Optional - will auto-generate if empty)</Label>
                <Input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="Leave empty to auto-generate"
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" className="primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                <Button 
                  type="button" 
                  className="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="primary"
                  onClick={() => {
                    console.log('Current formData:', formData);
                    console.log('Selected files:', selectedFiles);
                  }}
                >
                  Debug Form
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </ProductManagementContainer>
  );
};

export default ProductManagement; 