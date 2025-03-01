export const register = async () => {
  const info = await GM.info;
  if (info.scriptHandler === 'Tampermonkey') {
    const tab = await GM.getTab();
    if (tab.id) return;
    const tabs = await GM.getTabs();
    tab.id = Object.keys(tabs).pop();
    await GM.saveTab(tab);
  }
};
