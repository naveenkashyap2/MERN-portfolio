import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

export default function ProfileForm({ user, onSave, loading }) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSave({ name: data.get('name') });
      }}
    >
      <Input name="name" label="Name" defaultValue={user?.name} />
      <Input label="Email" value={user?.email || ''} readOnly />
      <Button type="submit" loading={loading}>
        Save profile
      </Button>
    </form>
  );
}
