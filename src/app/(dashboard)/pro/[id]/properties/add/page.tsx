import AddPropertyForm from '@/components/properties/AddPropertyForm';

export default function AddPropertyPage() {
  return (
    <section className='pt-32 pb-8 px-4 md:px-16'>
      <div className='container mx-auto'>
        <h1 className='text-3xl font-heading text-primary-950 mb-8'>
          Add New Property
        </h1>
        <AddPropertyForm />
      </div>
    </section>
  );
}
