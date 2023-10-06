export type BaseAccount = {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
};

export const getFullName = (account?: BaseAccount) => {
  if (!account) return '';
  return `${account.lastName} ${account.firstName}`;
};

export const getDefaultAvatarUrl = (account?: BaseAccount) => {
  const urlName = encodeURIComponent(getFullName(account));
  return `https://ui-avatars.com/api/?name=${urlName}&background=038ede&color=ffffff`;
};

export const getAvatarUrl = (account?: BaseAccount) => {
  return account?.avatarUrl || getDefaultAvatarUrl(account);
};

export const reloadSession = () => {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
};
