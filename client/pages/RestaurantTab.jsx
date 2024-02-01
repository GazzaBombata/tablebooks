import React, { useState, useEffect } from 'react';
import { CenteredSection, VerticalContainer, StyledH1, PrimaryButton, LeftAlignSection, StyledLabel, StyledInput, HorizontalContainer  } from '../components/styles.js';
import { fetchRestaurantForUser } from '../api/fetchRestaurantForUser.js'
import { createRestaurant } from '../api/createRestaurant.js'
import { updateRestaurant } from '../api/updateRestaurant.js'
import { uploadRestaurantPhotos } from '../api/uploadRestaurantPhotos.js';
import { useDispatch, useSelector } from 'react-redux';
import { setRestaurantId } from '../redux/store.js';
import { useQuery } from 'react-query';

function RestaurantTab() {
  
  const [formState, setFormState] = useState({
    Name: '',
    Address: '',
    PhoneNumber: '',
    Email: '',
    CoverPhoto: '',
    ProfilePhoto: '',
    OpeningTime: '',
    ClosingTime: '',
  });

const [originalPhotoUrls, setOriginalPhotoUrls] = useState({ CoverPhoto: null, ProfilePhoto: null });
const [currentPhotos, setCurrentPhotos] = useState({ CoverPhoto: null, ProfilePhoto: null });
const restaurantId = useSelector(state => state.restaurantId);

const dispatch = useDispatch();

const fetchRestaurantData = async () => {
  const restaurantData = await fetchRestaurantForUser();
  return restaurantData;
};

const { data: restaurantData, isLoading, isError } = useQuery('restaurantData', fetchRestaurantData);
  
useEffect(() => {
  if (restaurantData) {
    setFormState(restaurantData);
  }
}, [restaurantData]);

useEffect(() => {
  setOriginalPhotoUrls({ CoverPhoto: formState.CoverPhoto, ProfilePhoto: formState.ProfilePhoto });
  setCurrentPhotos({ CoverPhoto: null, ProfilePhoto: null }); 
}, [formState.CoverPhoto, formState.ProfilePhoto]);

const handleChange = (event) => {
  if (event.target.type === 'file') {
    setCurrentPhotos({
      ...currentPhotos,
      [event.target.name]: event.target.files[0],
    });
  } else {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  try {

    const { CoverPhoto, ProfilePhoto, ...otherFields } = formState;

    let imageUrls = { CoverPhoto: originalPhotoUrls.CoverPhoto, ProfilePhoto: originalPhotoUrls.ProfilePhoto };
    if (currentPhotos.CoverPhoto) {
      const name = 'coverPhoto'
      imageUrls.CoverPhoto = await uploadRestaurantPhotos(currentPhotos.CoverPhoto, name);
    }
    if (currentPhotos.ProfilePhoto) {
      const name = 'profilePhoto'
      imageUrls.ProfilePhoto = await uploadRestaurantPhotos(currentPhotos.ProfilePhoto, name);
    }

    console.log(imageUrls)

    const restaurantData = {
      ...otherFields,
      CoverPhoto: imageUrls.CoverPhoto.imageUrl,
      ProfilePhoto: imageUrls.ProfilePhoto.imageUrl,
    };

    if (restaurantId) {
      const updatedRestaurant = await updateRestaurant(restaurantId, restaurantData);
      
      console.log(updatedRestaurant);
      alert('Restaurant updated successfully!');
    } else {
      const newRestaurant = await createRestaurant(restaurantData);
      dispatch(setRestaurantId(newRestaurant.RestaurantID));
      console.log(newRestaurant);
      alert('Restaurant created successfully!');
    }
  } catch (error) {
    console.error(error);
  };
};

return (
  <LeftAlignSection>
    <StyledH1>Add a new Restaurant</StyledH1>
    <form onSubmit={handleSubmit}>
    <VerticalContainer $fitContent={true} $maxWidth="800px">
    {Object.keys(formState).map((key) => (
        <HorizontalContainer key={key}>
          <StyledLabel htmlFor={key}>{key}</StyledLabel>
          {key === 'CoverPhoto' || key === 'ProfilePhoto' ? (
            <>
              <StyledInput 
                type="file" 
                id={key} 
                name={key} 
                onChange={handleChange} 
              />
              {formState[key] && <img src={formState[key]} alt={key} style={{ width: '100px', height: '100px' }} />}
            </>
          ) : (
            <StyledInput 
              type="text" 
              id={key} 
              name={key} 
              value={formState[key]} 
              onChange={handleChange} 
            />
          )}
        </HorizontalContainer>
      ))}
        <HorizontalContainer>
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </HorizontalContainer>
      </VerticalContainer>
    </form>
  </LeftAlignSection>
);
}

export default RestaurantTab;