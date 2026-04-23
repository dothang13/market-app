import { useRef, useState } from 'react';
import PriceCard from './components/PriceCard';
import ScenarioBox from './components/ScenarioBox';
import { items } from './data/items';
import './App.css';

const names = ['chị Quế', 'chị Lâm', 'chị Phía', 'chị Mây', 'chị Hồng', 'chị Sương'];

const eventTemplates = [
  {
    type: 'ban-hang',
    verb: 'Bán',
    symbol: '×',
    label: 'Bán (×)',
    title: 'Bài toán bán hàng',
    summary: 'Luyện phép nhân từ giá bán ở chợ phiên.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item }) {
      const quantity = getTwoDigitValue(10, 99);
      const variants = [
        {
          text: `${actor} mang ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()} ra chợ. Mỗi ${item.unitMeasure} bán được ${item.price} đồng. Hỏi ${actor} thu về bao nhiêu đồng?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
          suffix: 'đồng',
        },
        {
          text: `Sạp của ${actor} có ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()}. Nếu bán hết với giá ${item.price} đồng mỗi ${item.unitMeasure}, ${actor} nhận được bao nhiêu đồng?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
          suffix: 'đồng',
        },
        {
          text: `${actor} bán ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()} trong một buổi chợ. Mỗi ${item.unitMeasure} giá ${item.price} đồng. Hỏi số tiền thu được là bao nhiêu?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
          suffix: 'đồng',
        },
      ];

      return getRandomFrom(variants);
    },
  },
  {
    type: 'mua-hang',
    verb: 'Mua',
    symbol: '-',
    label: 'Mua (-)',
    title: 'Bài toán mua hàng',
    summary: 'Luyện phép trừ khi dùng tiền đi chợ.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item }) {
      const startMoney = getTwoDigitValue(20, 99);
      const spendMoney = getOneDigitValue(1, Math.min(9, startMoney - 10));
      const variants = [
        {
          text: `${actor} có ${startMoney} đồng. ${actor} mua ${item.name.toLowerCase()} hết ${spendMoney} đồng. Hỏi còn lại bao nhiêu đồng?`,
          expression: `${startMoney} - ${spendMoney}`,
          result: startMoney - spendMoney,
          suffix: 'đồng',
        },
        {
          text: `${actor} cầm ${startMoney} đồng đi chợ và mua ${item.name.toLowerCase()} giá ${spendMoney} đồng. Hỏi sau khi mua xong còn bao nhiêu đồng?`,
          expression: `${startMoney} - ${spendMoney}`,
          result: startMoney - spendMoney,
          suffix: 'đồng',
        },
        {
          text: `Trong túi ${actor} có ${startMoney} đồng. Nếu mua ${item.name.toLowerCase()} mất ${spendMoney} đồng, ${actor} còn lại bao nhiêu đồng?`,
          expression: `${startMoney} - ${spendMoney}`,
          result: startMoney - spendMoney,
          suffix: 'đồng',
        },
      ];

      return getRandomFrom(variants);
    },
  },
  {
    type: 'them',
    verb: 'Thêm',
    symbol: '+',
    label: 'Thêm (+)',
    title: 'Bài toán thêm',
    summary: 'Luyện phép cộng với nông sản hoặc vật nuôi được thêm vào.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item }) {
      const baseCount = getTwoDigitValue();
      const extraCount = getOneDigitValue();
      const variants = [
        {
          text: `${actor} ban đầu có ${baseCount} ${item.unitMeasure} ${item.name.toLowerCase()}. Sau đó có thêm ${extraCount} ${item.unitMeasure}. Hỏi bây giờ ${actor} có tất cả bao nhiêu ${item.unitMeasure}?`,
          expression: `${baseCount} + ${extraCount}`,
          result: baseCount + extraCount,
          suffix: item.unitMeasure,
        },
        {
          text: `Buổi sáng ${actor} đếm được ${baseCount} ${item.unitMeasure} ${item.name.toLowerCase()}, buổi chiều có thêm ${extraCount} ${item.unitMeasure}. Hỏi cuối ngày có tất cả bao nhiêu ${item.unitMeasure}?`,
          expression: `${baseCount} + ${extraCount}`,
          result: baseCount + extraCount,
          suffix: item.unitMeasure,
        },
        {
          text: `${actor} đã chuẩn bị ${baseCount} ${item.unitMeasure} ${item.name.toLowerCase()}. Sau đó bà con đem tới thêm ${extraCount} ${item.unitMeasure}. Hỏi tổng cộng có bao nhiêu ${item.unitMeasure}?`,
          expression: `${baseCount} + ${extraCount}`,
          result: baseCount + extraCount,
          suffix: item.unitMeasure,
        },
      ];

      return getRandomFrom(variants);
    },
  },
  {
    type: 'chia-phan',
    verb: 'Chia',
    symbol: '÷',
    label: 'Chia (÷)',
    title: 'Bài toán chia phần',
    summary: 'Luyện phép chia đều cho bạn bè hoặc các nhóm.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item }) {
      const divisor = getOneDigitValue(2, 9);
      const quotient = getTwoDigitValue(10, 99);
      const total = divisor * quotient;
      const variants = [
        {
          text: `${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()} để chia đều cho ${divisor} bạn nhỏ. Hỏi mỗi bạn nhận được bao nhiêu ${item.unitMeasure}?`,
          expression: `${total} ÷ ${divisor}`,
          result: quotient,
          suffix: item.unitMeasure,
        },
        {
          text: `Lớp học của ${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()}. Cô giáo chia đều cho ${divisor} nhóm. Hỏi mỗi nhóm được mấy ${item.unitMeasure}?`,
          expression: `${total} ÷ ${divisor}`,
          result: quotient,
          suffix: item.unitMeasure,
        },
        {
          text: `${actor} gom ${total} ${item.unitMeasure} ${item.name.toLowerCase()} để phát đều cho ${divisor} gia đình. Hỏi mỗi gia đình nhận được bao nhiêu ${item.unitMeasure}?`,
          expression: `${total} ÷ ${divisor}`,
          result: quotient,
          suffix: item.unitMeasure,
        },
      ];

      return getRandomFrom(variants);
    },
  },
];

const createInitialScenario = () => ({
  type: 'san-sang',
  label: 'Sẵn sàng',
  title: 'Chọn phép tính và chọn món',
  summary: 'Học viên quay ra phép tính nào thì bấm đúng ô đó, sau đó chọn nông sản hoặc vật nuôi.',
  text: 'Chọn một trong bốn ô phép tính rồi chọn món ở ngay bên dưới để hiện câu hỏi.',
  answer: null,
  priceInfo: '',
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFrom(list) {
  return list[getRandomInt(0, list.length - 1)];
}

function getTwoDigitValue(min = 10, max = 99) {
  return getRandomInt(Math.max(10, min), Math.max(10, max));
}

function getOneDigitValue(min = 1, max = 9) {
  return getRandomInt(Math.max(1, min), Math.min(9, max));
}

function getTemplate(eventType) {
  return eventTemplates.find((entry) => entry.type === eventType) ?? eventTemplates[0];
}

function getAllowedItems(nextItems, eventType) {
  const template = getTemplate(eventType);
  return nextItems.filter((item) => template.allowedCategories.includes(item.category));
}

function buildScenario(nextItems, eventType, itemId) {
  const template = getTemplate(eventType);
  const item = nextItems.find((entry) => entry.id === itemId) ?? getAllowedItems(nextItems, eventType)[0];
  const actor = getRandomFrom(names);
  const scenarioData = template.buildScenario({ actor, item });
  const suffix = scenarioData.suffix ? ` ${scenarioData.suffix}` : '';

  return {
    type: template.type,
    label: template.label,
    title: `${template.title} (${template.symbol})`,
    summary: template.summary,
    text: scenarioData.text,
    itemId: item.id,
    verb: template.verb,
    priceInfo: `Giá chợ phiên hiện tại: ${item.name} ${item.price} ${item.unit}.`,
    answer: {
      expression: `${scenarioData.expression}${suffix}`,
      result: `${scenarioData.result}${suffix}`,
      statement: `${scenarioData.expression} = ${scenarioData.result}${suffix}`,
    },
  };
}

function App() {
  const [currentPrices, setCurrentPrices] = useState(items);
  const [scenario, setScenario] = useState(createInitialScenario);
  const [marketRound, setMarketRound] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeEventType, setActiveEventType] = useState(null);
  const [currentView, setCurrentView] = useState('market');
  const [showAnswer, setShowAnswer] = useState(false);
  const audioContextRef = useRef(null);

  const playTing = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = context;

    if (context.state === 'suspended') {
      context.resume().catch(() => {});
    }

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(720, now);
    oscillator.frequency.exponentialRampToValueAtTime(1180, now + 0.13);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.14, now + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.36);
  };

  const refreshMarket = () => {
    const updatedItems = items.map((item) => ({
      ...item,
      price: getRandomInt(1, 9),
    }));

    setCurrentPrices(updatedItems);
    setMarketRound((round) => round + 1);
    setSelectedItemId(null);
    setActiveEventType(null);
    setCurrentView('market');
    setScenario(createInitialScenario());
    setShowAnswer(false);
    playTing();
  };

  const handleSelectEvent = (eventType) => {
    setActiveEventType(eventType);
    setSelectedItemId(null);
    setCurrentView('picker');
    setScenario({
      ...createInitialScenario(),
      label: getTemplate(eventType).label,
      title: `Chọn món cho phép ${getTemplate(eventType).label}`,
      summary: 'Bấm chọn nông sản hoặc vật nuôi ở ngay dưới để hiện câu hỏi.',
      text: 'Câu hỏi sẽ xuất hiện ngay bên dưới sau khi bạn chọn món.',
    });
    setShowAnswer(false);
    playTing();
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId(itemId);

    if (activeEventType) {
      setScenario(buildScenario(currentPrices, activeEventType, itemId));
      setShowAnswer(false);
    }

    playTing();
  };

  const regenerateScenario = () => {
    if (!activeEventType || !selectedItemId) {
      return;
    }

    setScenario(buildScenario(currentPrices, activeEventType, selectedItemId));
    setShowAnswer(false);
    playTing();
  };

  const toggleAnswer = () => {
    setShowAnswer((current) => !current);
    playTing();
  };

  const goBackToMarket = () => {
    setCurrentView('market');
    setSelectedItemId(null);
    setShowAnswer(false);
    setScenario(createInitialScenario());
    playTing();
  };

  const allowedItems = activeEventType ? getAllowedItems(currentPrices, activeEventType) : [];
  const selectedItem = currentPrices.find((item) => item.id === selectedItemId);

  return (
    <main className="app-shell">
      <div className="backdrop-orb backdrop-orb--sun" aria-hidden="true" />
      <div className="backdrop-orb backdrop-orb--forest" aria-hidden="true" />

      {currentView === 'market' ? (
        <section className="screen-page screen-page--market">
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="hero-kicker">Bảng giá nông sản và máy tạo tình huống</p>
              <h1>BẢNG GIÁ CHỢ PHIÊN HỒNG BẮC</h1>

              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>{currentPrices.length}</strong>
                  <span>Nông sản</span>
                </div>
                <div className="hero-stat">
                  <strong>{marketRound}</strong>
                  <span>Phiên chợ</span>
                </div>
                <div className="hero-stat">
                  <strong>{selectedItem ? selectedItem.name : 'Chưa chọn'}</strong>
                  <span>Món đang chọn</span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-refresh" type="button" onClick={refreshMarket}>
                Cập nhật giá Chợ
              </button>
              <p className="hero-hint">
                Chọn phép tính trước, sau đó sang bước 2 để chọn món và xem câu hỏi.
              </p>
            </div>
          </section>

          <section className="verb-section" aria-label="Bốn phép tính">
            <div className="section-heading">
              <div>
                <h2>Bốn phép tính</h2>
                <p>Bán là nhân, Mua là trừ, Thêm là cộng, Chia là phép chia.</p>
              </div>
            </div>

            <div className="verb-grid">
              {eventTemplates.map((event, index) => (
                <button
                  key={event.type}
                  type="button"
                  className={`verb-card verb-card--${event.type}${activeEventType === event.type ? ' is-active' : ''}`}
                  onClick={() => handleSelectEvent(event.type)}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span className="verb-card__mini">Bước 1</span>
                  <strong>{event.label}</strong>
                  <span>{event.summary}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="market-section" aria-label="Bảng giá chợ phiên">
            <div className="section-heading">
              <div>
                <h2>Giá hôm nay</h2>
                <p>Xem giá hiện tại của các món để chuẩn bị cho câu hỏi.</p>
              </div>
            </div>

            <div className="price-grid">
              {currentPrices.map((item, index) => (
                <PriceCard
                  key={`${item.id}-${marketRound}`}
                  item={item}
                  marketRound={marketRound}
                  delay={index * 80}
                  isActive={item.id === selectedItemId}
                  onSelect={handleSelectItem}
                />
              ))}
            </div>
          </section>
        </section>
      ) : null}

      {currentView === 'picker' ? (
        <section className="screen-page screen-page--question">
          <section className="question-panel">
            <div className="question-panel__top">
              <button type="button" className="back-button" onClick={goBackToMarket}>
                ← Quay lại bước chọn phép tính
              </button>
              <div className="question-panel__badge">{getTemplate(activeEventType).label}</div>
            </div>

            <div className="item-picker">
              <p className="item-picker__label">Bước 2: Chọn nông sản hoặc vật nuôi</p>
              <div className="item-picker__options">
                {allowedItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`item-option${selectedItemId === item.id ? ' is-active' : ''}`}
                    data-category={item.category}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <span>{item.icon}</span>
                    <strong>{item.name}</strong>
                    <small>{item.price} {item.unit}</small>
                  </button>
                ))}
              </div>
            </div>

            <ScenarioBox
              scenario={scenario}
              activeItem={selectedItem}
              onRegenerate={regenerateScenario}
              showAnswer={showAnswer}
              onToggleAnswer={toggleAnswer}
            />
          </section>
        </section>
      ) : null}
    </main>
  );
}

export default App;
