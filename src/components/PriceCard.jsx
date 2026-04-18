import { useState } from 'react';

function PriceCard({ item, marketRound, delay = 0, isActive, onSelect }) {
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 10;
    const rotateX = (((offsetY / bounds.height) - 0.5) * -10);

    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`,
    });
  };

  const resetTilt = () => {
    setTiltStyle({});
  };

  return (
    <button
      type="button"
      className={`price-card${marketRound > 0 ? ' is-updating' : ''}${isActive ? ' is-active' : ''}`}
      style={{ animationDelay: `${delay}ms`, ...tiltStyle }}
      onClick={() => onSelect(item.id)}
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      onBlur={resetTilt}
    >
      <div className="price-card__glow" aria-hidden="true" />
      <span className="price-card__icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="price-card__pin">{isActive ? 'Đang chọn' : 'Chạm để chọn'}</span>
      <h3>{item.name}</h3>
      <p className="price-card__unit">Đơn vị: {item.unit}</p>
      <p className="price-card__price">
        <span>{item.price}</span>
        <small>đồng</small>
      </p>
    </button>
  );
}

export default PriceCard;
