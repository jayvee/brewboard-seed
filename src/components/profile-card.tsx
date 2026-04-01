type ProfileCardProps = {
  username: string;
  beerCount: number;
};

export default function ProfileCard({ username, beerCount }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4">
      <h2 className="font-semibold text-lg text-stone-900">{username}</h2>
      <p className="text-stone-600 text-sm mt-1">{beerCount} beers in collection</p>
    </div>
  );
}
