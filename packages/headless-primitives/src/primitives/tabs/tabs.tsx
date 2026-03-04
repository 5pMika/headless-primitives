import { TabsRoot } from './tabs-root';
import { TabsList } from './tabs-list';
import { TabsTrigger } from './tabs-trigger';
import { TabsContent } from './tabs-content';

export type { TabsRootProps } from './tabs-root';
export type { TabsListProps } from './tabs-list';
export type { TabsTriggerProps } from './tabs-trigger';
export type { TabsContentProps } from './tabs-content';

export { TabsRoot, TabsList, TabsTrigger, TabsContent };

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
