interface ProfileCardProps {
  username: string;
  beerCount: number;
}

export default function ProfileCard({ username, beerCount }: ProfileCardProps) {
  return (
    <div>
      <h2>{username}</h2>
      <p>{beerCount}</p>
    </div>
  );
}
