import { createNavigation } from 'next-intl/navigation';
import { routing } from './route';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
