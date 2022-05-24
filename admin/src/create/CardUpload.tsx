import { FileField, FileInput, SimpleForm } from 'react-admin';
import { FieldValues } from 'react-hook-form';

export function CardUpload(): JSX.Element {
  const uploadCards = (data: FieldValues) => {
    const formData = new FormData();
    formData.append('file', data.file.rawFile);

    fetch('/api/cards/upload', {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.status === 201) {
        window.location.href = '/admin/cards';
      }
    });
  };

  return (
    <SimpleForm onSubmit={uploadCards}>
      <FileInput
        source="file"
        label="CSV file with cards"
        accept=".csv"
        name="file"
      >
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  );
}
