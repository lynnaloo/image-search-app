import React, { useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import './index.css';

const IMAGES_PER_PAGE = 5;

const App = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleTextSearch = (event) => {
    event.preventDefault();
    fetchImages();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    reader.readAsDataURL(file);
    // fetchImages();
  }

  const fetchImages = async () => {
    let fullUrl = `${process.env.REACT_APP_API_URL}?query=${searchInput.current.value}&page=1&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_IMAGE_API_KEY}`;
    console.log(fullUrl);

    try {
      const { data } = await axios.get(fullUrl);
      // DEBUG:
      console.log('data', data);
      setImages(data.results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>Image Search</h1>
      <div className='search-section'>
        <Form onSubmit={handleTextSearch}>
          <Form.Group>
            <Form.Label className='fw-bold'>Search by image</Form.Label>
            <Form.Control
              type="file"
              size="lg"
              accept="image/*"
              onChange={handleImageChange}
            />
            {selectedImage && <img src={selectedImage} alt='Preview' className='imagePreview' width='200' height='200'/>}
          </Form.Group>

          <Form.Group className='mt-5'>
          <Form.Label className='fw-bold'>Search by keywords</Form.Label>
            <Form.Control
              type='search'
              placeholder='Keyword search'
              className='search-input'
              ref={searchInput}
            />
          </Form.Group>
        </Form>
      </div>
      <div className='images'>
      {images.map((image) => {
        return (
          <div key={image.id}>
            <img
              key={image.id}
              src={image.urls.small}
              alt={image.alt_description}
              className='image'
            />
            <div className='imageText'>{image.alt_description}</div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default App;