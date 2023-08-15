// @ts-ignore
import i18n from "i18n-js"
import en, {Translations} from "./en";
import ko from "./ko";

i18n.translations = {
    en,
    ko
};

i18n.locale = 'ko';

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
    [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
    [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
        TObj[TKey],
        `['${TKey}']` | `.${TKey}`
    >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
    ? Text
    : TValue extends object
        ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
        : Text


type TxKeyPath = RecursiveKeyOf<Translations>

export function translate(key: TxKeyPath, options?: i18n.TranslateOptions) {
    return i18n.t(key, options)
}
