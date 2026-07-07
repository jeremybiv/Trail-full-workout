interface Props {
  id: string;
  paused?: boolean;
}

export function ExercisePhoto({ id, paused }: Props) {
  return (
    <div className={`ex-photo${paused ? ' paused' : ''}`}>
      <img className="p0" src={`/exercises/${id}-0.jpg`} alt="" />
      <img className="p1" src={`/exercises/${id}-1.jpg`} alt="" />
    </div>
  );
}
