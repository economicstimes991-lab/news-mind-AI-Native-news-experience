const ALL_INTERESTS = [
  'startups',
  'markets',
  'technology',
  'policy',
  'india',
  'global',
  'funding',
  'fintech'
];

export default function InterestSelector({ selected, onChange }) {
  const toggle = (interest) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((i) => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  return (
    <div className="interest-selector">
      <h3>Your interests</h3>
      <div className="interest-chips">
        {ALL_INTERESTS.map((interest) => (
          <button
            key={interest}
            type="button"
            className={
              selected.includes(interest)
                ? 'chip chip-active'
                : 'chip'
            }
            onClick={() => toggle(interest)}
          >
            {interest}
          </button>
        ))}
      </div>
    </div>
  );
}