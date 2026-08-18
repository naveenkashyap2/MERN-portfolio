import Button from '../../../components/ui/Button.jsx';

export default function AITripGenerator({ onGenerate, loading }) {
  return (
    <Button loading={loading} onClick={onGenerate}>
      Generate My Trip ✨
    </Button>
  );
}
