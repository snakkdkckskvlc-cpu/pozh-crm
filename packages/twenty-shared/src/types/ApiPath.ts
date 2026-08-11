// Adding or renaming a value here also requires updating the nginx ingress rules
// in the infra repo, which route these prefixes to the server instead of the front.
export enum ApiPath {
  AdminPanel = 'admin-panel',
  App = 'app',
  ApplicationRegistrationClaim = 'application-registration-claim',
  Apps = 'apps',
  Auth = 'auth',
  ClientConfig = 'client-config',
  Cloudflare = 'cloudflare',
  Emailing = 'emailing',
  File = 'file',
  FileUpload = 'file-upload',
  Files = 'files',
  GraphQL = 'graphql',
  Health = 'healthz',
  Mcp = 'mcp',
  Metadata = 'metadata',
  OAuth = 'oauth',
  OpenApi = 'open-api',
  PublicAssets = 'public-assets',
  // пожсервис: путь к ручкам связи со службой документов. Внесён сюда, чтобы
  // сборщик страниц проксировал его наравне с остальными: иначе браузер шёл бы
  // на другой адрес напрямую, и это пришлось бы разрешать в политике
  // содержимого — то есть ослаблять защиту ради одной ручки.
  Pozh = 'pozh',
  Rest = 'rest',
  RouteTrigger = 's',
  Webhooks = 'webhooks',
  WellKnown = '.well-known',
}
