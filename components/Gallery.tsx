import React from 'react'

const Gallery = ({ imageUrlList }:any) => {
  return (
    <div className="mt-5 w-full h-[500px] overflow-y-scroll">
      <div className="flex items-center justify-center flex-wrap gap-4 columns-3 w-full">
        {imageUrlList.map((item: any, index: number) => (
          <div key={index}>
            <img src={item.imageUrl} alt="" className="w-96 h-96 rounded-xl" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery