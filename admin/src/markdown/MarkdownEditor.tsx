import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { FormControl } from '@mui/material';
import { useController } from 'react-hook-form';

/**
 * A react-admin custom component to handle markdown input. Using react-md-editor (https://github.com/uiwjs/react-md-editor).
 *
 * According to their documentation:
 * 'Please note markdown needs to be sanitized if you do not completely trust your authors. Otherwise, your app is vulnerable to XSS. This can be achieved by adding rehype-sanitize as a plugin.'
 *
 * @author Jelle Huibregtse
 */

interface Props {
  source: string;
}

export default function MarkdownEditor({ source }: Props): JSX.Element {
  const input = useController({ name: source });

  return (
    <FormControl fullWidth={true}>
      <MDEditor
        value={input.field.value}
        onChange={input.field.onChange}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
      />
    </FormControl>
  );
}
