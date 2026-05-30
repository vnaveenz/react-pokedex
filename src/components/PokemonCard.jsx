import styles from './PokemonCard.module.css';

/**
 * PokemonCard - Displays a single Pokemon's info.
 *
 * Props:
 *   - pokemon: object with { id, name, sprites, types, stats }
 *
 * KEY REACT CONCEPTS demonstrated here:
 *   1. Props - data passed from parent to child
 *   2. .map() - rendering lists from arrays
 *   3. CSS Modules - scoped styles via `styles.className`
 *   4. Template literals - building dynamic strings
 */
function PokemonCard({ pokemon }) {
  const { id, name, sprites, types, stats } = pokemon;

  // Pick the best available sprite image
  const imageUrl =
    sprites.other?.['official-artwork']?.front_default ||
    sprites.front_default;

  // Format the ID as #001, #025, etc.
  const formattedId = `#${String(id).padStart(3, '0')}`;

  // Pull out a few key stats to display
  const displayStats = stats
    .filter((s) => ['hp', 'attack', 'defense', 'speed'].includes(s.stat.name))
    .map((s) => ({ name: s.stat.name, value: s.base_stat }));

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={name}
          loading="lazy"
        />
      </div>

      <span className={styles.id}>{formattedId}</span>
      <h2 className={styles.name}>{name}</h2>

      <div className={styles.types}>
        {types.map((t) => (
          <span
            key={t.type.name}
            className={`${styles.typeBadge} ${styles[t.type.name] || ''}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>

      <div className={styles.stats}>
        {displayStats.map((s) => (
          <div key={s.name} className={styles.stat}>
            <span className={styles.statLabel}>{s.name}</span>
            <span className={styles.statValue}>{s.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default PokemonCard;
