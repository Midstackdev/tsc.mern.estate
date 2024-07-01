import { useState } from 'react';
import { IListing } from '../pages/CreateListing';

type Props = {
  listing: IListing;
};

const Slider = ({ listing }: Props) => {
  const images = listing.imageUrls;
  const [imageIndex, setImageIndex] = useState(0);

  const slide = (direction: string) => {
    let newImageIndex;

    if (direction === 'left') {
      newImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
    } else {
      newImageIndex = imageIndex === images.length - 1 ? 0 : imageIndex + 1;
    }
    setImageIndex(newImageIndex);
  };

  return (
    <div className="">
      {imageIndex !== null && (
        <div className="flex justify-center items-center">
          <div className="text-lg cursor-pointer" onClick={() => slide('left')}>
            <span style={{ fontSize: '50px' }}>&#9665;</span>
          </div>
          <div className="">
            <img
              src={images[imageIndex].url ?? images[imageIndex]}
              alt=""
              className="h-[550px]"
            />
          </div>
          <div
            className="text-lg cursor-pointer"
            onClick={() => slide('right')}
          >
            <span style={{ fontSize: '50px' }}>&#9655;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
