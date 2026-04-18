import { useRef, useState } from 'react';
import PriceCard from './components/PriceCard';
import ScenarioBox from './components/ScenarioBox';
import { items } from './data/items';
import './App.css';

const names = ['A Vàng', 'Lan', 'Hồng Bắc', 'Y Nhi', 'Pơ Loong', 'Hải'];

const eventTemplates = [
  {
    type: 'ban-hang',
    verb: 'Bán (×)',
    label: 'Bán hàng',
    title: 'Bài toán bán hàng',
    summary: 'Tính số tiền thu được khi đem nông sản ra chợ phiên.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item, quantity, extra }) {
      const variants = [
        {
          text: `${actor} mang ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()} ra chợ. Mỗi ${item.unitMeasure} bán được ${item.price} đồng. Hỏi ${actor} thu về bao nhiêu đồng?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
        },
        {
          text: `Sạp của ${actor} có ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()} giống nhau. Nếu bán hết với giá ${item.price} đồng mỗi ${item.unitMeasure}, ${actor} nhận được bao nhiêu đồng?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
        },
      ];

      return getRandomFrom(variants);
    },
  },
  {
    type: 'mua-hang',
    verb: 'Trừ (-)',
    label: 'Trừ đi',
    title: 'Bài toán trừ đi',
    summary: 'Luyện phép trừ qua các tình huống bớt, cho hoặc sử dụng.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item, quantity, extra }) {
      const total = quantity + extra;
      const variants = [];

      if (item.category === 'vat-nuoi') {
        variants.push({
          text: `${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()} trong chuồng. ${actor} cho đi ${extra} ${item.unitMeasure}. Hỏi còn lại bao nhiêu ${item.unitMeasure}?`,
          expression: `${total} - ${extra}`,
          result: total - extra,
        });
        variants.push({
          text: `${actor} nuôi được ${total} ${item.unitMeasure} ${item.name.toLowerCase()}, sau đó bán ${extra} ${item.unitMeasure}. Hỏi còn lại bao nhiêu?`,
          expression: `${total} - ${extra}`,
          result: total - extra,
        });
      } else if (item.category === 'nong-san') {
        variants.push({
          text: `${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()} ở vườn. ${actor} dùng ${extra} ${item.unitMeasure} để ăn. Hỏi còn lại bao nhiêu ${item.unitMeasure}?`,
          expression: `${total} - ${extra}`,
          result: total - extra,
        });
        variants.push({
          text: `${actor} thu hoạch được ${total} ${item.unitMeasure} ${item.name.toLowerCase()}, sau đó tặng ${extra} ${item.unitMeasure} cho hàng xóm. Hỏi còn lại bao nhiêu?`,
          expression: `${total} - ${extra}`,
          result: total - extra,
        });
      } else {
        variants.push({
          text: `${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()}. ${actor} cho đi ${extra} ${item.unitMeasure}. Hỏi còn lại bao nhiêu ${item.unitMeasure}?`,
          expression: `${total} - ${extra}`,
          result: total - extra,
        });
      }

      return getRandomFrom(variants);
    },
  },
  {
    type: 'de-them',
    verb: 'Đẻ thêm (+)',
    label: 'Đẻ thêm',
    title: 'Bài toán đẻ thêm',
    summary: 'Luyện phép cộng qua câu chuyện vật nuôi tăng lên.',
    allowedCategories: ['vat-nuoi'],
    buildScenario({ actor, item, quantity, extra }) {
      const variants = [];
      if (item.category === 'nong-san') {
        variants.push({
          text: `${actor} thu hoạch được ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()}. Nếu bán mỗi ${item.unitMeasure} được ${item.price} đồng, hỏi thu về bao nhiêu?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
        });
        variants.push({
          text: `${actor} thu hoạch ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()} hôm nay. Giá mỗi ${item.unitMeasure} là ${item.price} đồng. Hỏi tổng tiền thu được?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
        });
      } else if (item.category === 'vat-nuoi') {
        variants.push({
          text: `${actor} có ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()} để bán. Mỗi ${item.unitMeasure} được ${item.price} đồng. Hỏi tổng tiền thu được?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
        });
      } else {
        variants.push({
          text: `${actor} có ${quantity} ${item.unitMeasure} ${item.name.toLowerCase()}. Nếu bán với giá ${item.price} đồng mỗi ${item.unitMeasure}, hỏi thu về bao nhiêu?`,
          expression: `${quantity} × ${item.price}`,
          result: quantity * item.price,
        });
      }

      return getRandomFrom(variants);
    },
  },
  {
    type: 'chia-phan',
    verb: 'Chia (÷)',
    label: 'Chia phần',
    title: 'Bài toán chia phần',
    summary: 'Luyện phép chia đều cho bạn bè hoặc các nhóm.',
    allowedCategories: ['nong-san', 'vat-nuoi', 'tho-cam'],
    buildScenario({ actor, item, quantity, extra }) {
      const total = quantity * extra;
      const variants = [
        {
          text: `${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()} để chia đều cho ${quantity} bạn nhỏ. Hỏi mỗi bạn nhận được bao nhiêu ${item.unitMeasure}?`,
          expression: `${total} ÷ ${quantity}`,
          result: total / quantity,
        },
        {
          text: `Lớp học của ${actor} có ${total} ${item.unitMeasure} ${item.name.toLowerCase()}. Cô giáo chia đều cho ${quantity} nhóm. Hỏi mỗi nhóm được mấy ${item.unitMeasure}?`,
          expression: `${total} ÷ ${quantity}`,
          result: total / quantity,
        },
      ];

      return getRandomFrom(variants);
    },
  },
];

const animalOptions = items.filter((item) => item.category === 'vat-nuoi');

const createInitialScenario = () => ({
  type: 'san-sang',
  label: 'Sẵn sàng',
  title: 'Chọn một động từ để bắt đầu',
  summary: 'Học viên quay vòng xoay ra sự việc nào thì bấm đúng nút đó.',
  text: 'Bấm vào một nút động từ như Bán, Mua, Đẻ thêm hoặc Chia để mở sang trang câu hỏi ngẫu nhiên.',
  answer: null,
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFrom(list) {
  return list[getRandomInt(0, list.length - 1)];
}

function getEligibleItems(nextItems, template, preferredItemId) {
  const allowedItems = nextItems.filter((item) =>
    template.allowedCategories.includes(item.category),
  );

  if (preferredItemId) {
    const matchedItem = allowedItems.find((item) => item.id === preferredItemId);
    if (matchedItem) {
      return matchedItem;
    }
  }

  return getRandomFrom(allowedItems);
}

function buildScenario(nextItems, eventType, preferredItemId) {
  const template = eventTemplates.find((entry) => entry.type === eventType) ?? eventTemplates[0];
  const item = getEligibleItems(nextItems, template, preferredItemId);
  const quantity = getRandomInt(2, 8);
  const extra = getRandomInt(2, 5);
  const actor = getRandomFrom(names);
  const scenarioData = template.buildScenario({ actor, item, quantity, extra });

  return {
    type: template.type,
    label: template.label,
    title: template.title,
    summary: template.summary,
    text: scenarioData.text,
    itemId: item.id,
    verb: template.verb,
    answer: {
      expression: scenarioData.expression,
      result: scenarioData.result,
      statement: `${scenarioData.expression} = ${scenarioData.result}`,
    },
  };
}

function App() {
  const [currentPrices, setCurrentPrices] = useState(items);
  const [scenario, setScenario] = useState(createInitialScenario);
  const [marketRound, setMarketRound] = useState(0);
  const [focusedItemId, setFocusedItemId] = useState(null);
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
    playTing();
  };

  const handleSelectItem = (itemId) => {
    setFocusedItemId((currentId) => (currentId === itemId ? null : itemId));
    playTing();
  };

  const openScenarioPage = (eventType) => {
    // Open the question view but don't generate a question yet.
    // Show the allowed items for the selected verb and wait for user to pick.
    setActiveEventType(eventType);
    setFocusedItemId(null);
    setScenario(createInitialScenario());
    setShowAnswer(false);
    setCurrentView('question');
    playTing();
  };

  const regenerateScenario = () => {
    if (!activeEventType) {
      return;
    }

    setScenario(buildScenario(currentPrices, activeEventType, focusedItemId));
    setShowAnswer(false);
    playTing();
  };

  const goBackToMarket = () => {
    setCurrentView('market');
    setShowAnswer(false);
    playTing();
  };

  const handlePickAllowedItem = (itemId) => {
    setFocusedItemId(itemId);
    // Immediately create a scenario for the selected verb+item
    setScenario(buildScenario(currentPrices, activeEventType, itemId));
    setShowAnswer(false);
    playTing();
  };

  const createQuestionFromSelection = () => {
    if (!activeEventType || !focusedItemId) return;
    setScenario(buildScenario(currentPrices, activeEventType, focusedItemId));
    setShowAnswer(false);
    playTing();
  };

  const toggleAnswer = () => {
    setShowAnswer((current) => !current);
    playTing();
  };

  const focusedItem = currentPrices.find((item) => item.id === focusedItemId);

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
                  <strong>{focusedItem ? focusedItem.name : 'Tự do'}</strong>
                  <span>Nông sản ưu tiên</span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-refresh" type="button" onClick={refreshMarket}>
                Cập nhật giá Chợ
              </button>
              <p className="hero-hint">
                Muốn đổi dữ liệu phiên chợ thì bấm nút này trước khi chọn động từ.
              </p>
            </div>
          </section>

          <section className="verb-section" aria-label="Nút động từ">
            <div className="section-heading">
              <div>
                <h2>Nút động từ</h2>
                <p>Khi vòng xoay ra sự việc nào, chỉ cần bấm đúng nút đó để sang trang câu hỏi.</p>
              </div>
            </div>

            <div className="verb-grid">
              {eventTemplates.map((event, index) => (
                <button
                  key={event.type}
                  type="button"
                  className={`verb-card verb-card--${event.type}`}
                  onClick={() => openScenarioPage(event.type)}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span className="verb-card__mini">Bấm để mở câu hỏi</span>
                  <strong>{event.verb}</strong>
                  <span>{event.summary}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="market-section" aria-label="Bảng giá chợ phiên">
            <div className="section-heading">
              <div>
                <h2>Giá hôm nay</h2>
                <p>Chạm vào từng thẻ để ưu tiên món đó trong câu hỏi kế tiếp.</p>
              </div>

              <div className="market-badge">
                {focusedItem ? `Đang ghim: ${focusedItem.name}` : 'Chưa ghim nông sản'}
              </div>
            </div>

            <div className="price-grid">
              {currentPrices.map((item, index) => (
                <PriceCard
                  key={`${item.id}-${marketRound}`}
                  item={item}
                  marketRound={marketRound}
                  delay={index * 80}
                  isActive={item.id === focusedItemId}
                  onSelect={handleSelectItem}
                />
              ))}
            </div>
          </section>
        </section>
      ) : (
        <section className="screen-page screen-page--question">
          <section className="question-panel">
            <div className="question-panel__top">
              <button type="button" className="back-button" onClick={goBackToMarket}>
                ← Quay lại bảng giá
              </button>
              <div className="question-panel__badge">
                {activeEventType ? eventTemplates.find((event) => event.type === activeEventType)?.verb : ''}
              </div>
            </div>

            {activeEventType ? (
              <div className="item-picker">
                <p className="item-picker__label">Chọn nông sản hoặc vật nuôi (theo động từ)</p>
                <div className="item-picker__options">
                  {currentPrices
                    .filter((it) =>
                      eventTemplates
                        .find((e) => e.type === activeEventType)
                        .allowedCategories.includes(it.category),
                    )
                    .map((item) => (
                      <button
                          key={item.id}
                          type="button"
                          data-category={item.category}
                          className={`item-option${focusedItemId === item.id ? ' is-active' : ''}`}
                          onClick={() => handlePickAllowedItem(item.id)}
                        >
                        <span>{item.icon}</span>
                        <strong>{item.name}</strong>
                        <small>{item.unit} · {item.price} đồng</small>
                      </button>
                    ))}
                </div>

                <div className="item-picker__actions">
                  <button type="button" className="ghost-button" onClick={goBackToMarket}>
                    Hủy chọn
                  </button>
                </div>
              </div>
            ) : null}

            {focusedItemId && scenario && scenario.type !== 'san-sang' ? (
              <ScenarioBox
                scenario={scenario}
                activeItem={focusedItem}
                onRegenerate={regenerateScenario}
                showAnswer={showAnswer}
                onToggleAnswer={toggleAnswer}
              />
            ) : (
              <div className="picker-instruction">
                <p>Chọn một sản phẩm ở phía trên để tạo câu hỏi tương ứng.</p>
              </div>
            )}

            <div className="question-actions">
              <button type="button" className="scenario-box__action" onClick={regenerateScenario}>
                Câu hỏi khác cùng động từ
              </button>
              <button type="button" className="ghost-button" onClick={goBackToMarket}>
                Chọn động từ khác
              </button>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

export default App;
