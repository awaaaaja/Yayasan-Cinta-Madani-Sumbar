import { reactive, computed } from 'vue';

type ValidationRules = Record<string, ((value: unknown) => string | null)[]>;

export function useFormValidation(rules: ValidationRules) {
  const errors = reactive<Record<string, string>>({});
  const touched = reactive<Record<string, boolean>>({});

  function validate(values: Record<string, unknown>): boolean {
    let valid = true;
    Object.keys(errors).forEach(k => delete errors[k]);

    for (const [field, fieldRules] of Object.entries(rules)) {
      for (const rule of fieldRules) {
        const err = rule(values[field]);
        if (err) {
          errors[field] = err;
          valid = false;
          break;
        }
      }
    }
    return valid;
  }

  function touch(field: string) {
    touched[field] = true;
  }

  function clearErrors() {
    Object.keys(errors).forEach(k => delete errors[k]);
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0);

  return { errors, touched, validate, touch, clearErrors, hasErrors };
}

export function required(label: string) {
  return (value: unknown): string | null => {
    if (value === null || value === undefined || value === '') return `${label} wajib diisi`;
    if (Array.isArray(value) && value.length === 0) return `${label} wajib dipilih`;
    return null;
  };
}

export function requiredIf(label: string, condition: () => boolean) {
  return (value: unknown): string | null => {
    if (condition() && (value === null || value === undefined || value === '')) {
      return `${label} wajib diisi`;
    }
    return null;
  };
}

export function maxLength(label: string, max: number) {
  return (value: unknown): string | null => {
    if (typeof value === 'string' && value.length > max) return `${label} maksimal ${max} karakter`;
    return null;
  };
}

export function minLength(label: string, min: number) {
  return (value: unknown): string | null => {
    if (typeof value === 'string' && value.length > 0 && value.length < min) return `${label} minimal ${min} karakter`;
    return null;
  };
}

export function validSlug() {
  return (value: unknown): string | null => {
    if (typeof value === 'string' && value.length > 0 && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Slug hanya boleh berisi huruf kecil, angka, dan strip';
    }
    return null;
  };
}
