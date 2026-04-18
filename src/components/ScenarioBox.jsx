function ScenarioBox({ scenario, activeItem, onRegenerate, showAnswer, onToggleAnswer }) {
  return (
    <div className="scenario-box">
      <div className="scenario-box__header">
        <div className="scenario-box__title-wrap">
          <span className="scenario-box__badge">{scenario.label ?? 'Sẵn sàng'}</span>
          <h2>{scenario.title}</h2>
        </div>

        <button type="button" className="scenario-box__action" onClick={onRegenerate}>
          Đổi câu hỏi
        </button>
      </div>

      <div className="scenario-box__meta">
        <span>{`Nhóm sự việc: ${scenario.label}`}</span>
        <span>{activeItem ? `Nông sản ưu tiên: ${activeItem.name}` : 'Nông sản: Tự chọn tự động'}</span>
      </div>

      <p className="scenario-box__summary">{scenario.summary}</p>
      <p className="scenario-box__text">{scenario.text}</p>

      {scenario.answer ? (
        <div className="answer-toggle">
          <button type="button" className="answer-toggle__button" onClick={onToggleAnswer}>
            {showAnswer ? 'Ẩn đáp án' : 'Hiện đáp án'}
          </button>

          {showAnswer ? (
            <div className="answer-box">
              <p className="answer-box__label">Phép tính</p>
              <p className="answer-box__expression">{scenario.answer.expression}</p>
              <p className="answer-box__result">Đáp án: {scenario.answer.statement}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default ScenarioBox;
