### STORY-4: forms package docs

#### What and why

A developer using `@react-native-ama/forms` finds that `FormSubmit.md` has no Props or Methods sections, and `useFormSubmit` has no standalone doc page despite being a public export. This story completes the forms docs so every export in `package.json` has a page with the four required sections, verified against source.

#### Done when

**Form**
- [ ] `Form.md` has the four required sections (Usage, Properties, Methods); existing content is verified against `packages/forms/src/components/Form.tsx` — specifically the `FormProps` type (at minimum `onSubmit` required) and `FormActions` methods (`focusFirstInvalidField`, `focusFieldAt`)
- [ ] Props and Methods sections accurately reflect the current source type definitions

**Form.Field (FormField)**
- [ ] `FormField.md` has the four required sections; Props verified against `packages/forms/src/components/FormField.tsx` and the exported `FormFieldProps` type

**Form.Submit (FormSubmit)**
- [ ] `FormSubmit.md` has the four required sections: Usage with code example, Properties listing `FormSubmitProps` (including the render-prop signature `FormSubmitRenderProps`), Methods (or explicit "None" if the component exposes none), and no Dev-mode banner (it is not dev-only)
- [ ] Props section is verified against `packages/forms/src/components/FormSubmit.tsx` and the exported `FormSubmitProps` / `FormSubmitRenderProps` types

**TextInput**
- [ ] `TextInput.mdx` has the four required sections; Props verified against `packages/forms/src/components/TextInput.tsx` and the exported `TextInputProps` type
- [ ] Any prop present in source but missing from the page is added; any documented prop not in source is removed

**useFormField**
- [ ] `useFormField.md` has the four required sections; Parameters and Return values verified against `packages/forms/src/hooks/useFormField.ts` and the exported `UseFormField` type

**useFormSubmit (new page)**
- [ ] A new `useFormSubmit.md` page exists under `packages/forms/docs/`
- [ ] Page has a Usage section: `import { useFormSubmit } from '@react-native-ama/forms'` and a code example showing `const { submitForm } = useFormSubmit()`
- [ ] Page has a Parameters section (no parameters; the hook reads Form context internally)
- [ ] Page has a Returns section documenting `{ submitForm: () => Promise<void> }` — verified against `packages/forms/src/hooks/useFormSubmit.ts`
- [ ] Page notes that `useFormSubmit` must be used inside a `<Form>` provider

**useTextInput**
- [ ] `useTextInput.md` has the four required sections; Parameters and Returns verified against `packages/forms/src/hooks/useTextInput.ts` and the exported `UseTextInput` type

#### Not this story
- Creating docs for any hook not in the `package.json` exports
- Fixing any source code
- Any other package's docs

#### Notes

`FormSubmit.md` currently has only a Usage snippet and an "Alternative API" note. Both the Props/Methods sections and the description of `FormSubmitRenderProps` (the render-prop shape: `{ onPress }`) need to be authored from source.

`useFormSubmit` takes no arguments; its only return value is `submitForm`. The Parameters section should note "None — the hook reads the Form context internally" rather than being omitted.

`useFormField` and `useTextInput` already have pages — verify them rather than rewriting from scratch.

#### Implementation Reference

- **Files (update):** `packages/forms/docs/Form.md`, `packages/forms/docs/FormField.md`, `packages/forms/docs/FormSubmit.md`, `packages/forms/docs/TextInput.mdx`, `packages/forms/docs/useFormField.md`, `packages/forms/docs/useTextInput.md`
- **Files (create):** `packages/forms/docs/useFormSubmit.md`
- **Authoritative export list:** `"exports"` field in `packages/forms/package.json` — 7 keys: `./Form`, `./FormField`, `./FormSubmit`, `./TextInput`, `./useFormField`, `./useFormSubmit`, `./useTextInput`
- **Source for type verification:** `packages/forms/src/components/Form.tsx` (`FormProps`, `FormActions`), `packages/forms/src/components/FormField.tsx` (`FormFieldProps`), `packages/forms/src/components/FormSubmit.tsx` (`FormSubmitProps`, `FormSubmitRenderProps`), `packages/forms/src/components/TextInput.tsx` (`TextInputProps`), `packages/forms/src/hooks/useFormField.ts` (`UseFormField`), `packages/forms/src/hooks/useFormSubmit.ts` (`UseFormSubmit`), `packages/forms/src/hooks/useTextInput.ts` (`UseTextInput`)
- **Import path:** `@react-native-ama/forms`
- **Do not:** add dev-mode banners to non-dev exports; touch source files

---
<!-- ⚠️ When this story is implemented, update its status to `done` in the stories README.md index. -->
