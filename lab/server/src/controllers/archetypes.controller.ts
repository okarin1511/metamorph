import { Request, Response } from 'express';
import { resolve } from 'node:path';
import type { ArchetypeInfo } from '../types/index.js';

const ARCHETYPES: ArchetypeInfo[] = [
  {
    id: 'react-spa-minimal',
    name: 'React SPA Minimal',
    category: 'frontend',
    path: resolve(process.cwd(), 'lab/archetypes/frontend/react-spa-minimal'),
    description: 'Minimal baseline React SPA with single view component and Vite bundler.',
    sourceFramework: 'react',
    recommendedTargets: ['next', 'vue', 'svelte', 'angular'],
  },
  {
    id: 'react-spa-full',
    name: 'React SPA Full',
    category: 'frontend',
    path: resolve(process.cwd(), 'lab/archetypes/frontend/react-spa-full'),
    description: 'Comprehensive React SPA with multi-route navigation, layout, and client state.',
    sourceFramework: 'react',
    recommendedTargets: ['next', 'vue', 'svelte'],
  },
  {
    id: 'express-minimal',
    name: 'Express Minimal',
    category: 'backend',
    path: resolve(process.cwd(), 'lab/archetypes/backend/express-minimal'),
    description: 'Single-file Express server with standard HTTP endpoints.',
    sourceFramework: 'express',
    recommendedTargets: ['hono', 'fastify', 'nestjs'],
  },
  {
    id: 'express-layered-api',
    name: 'Express Layered API',
    category: 'backend',
    path: resolve(process.cwd(), 'lab/archetypes/backend/express-layered-api'),
    description: 'Layered architecture Express API with dedicated routes, controllers, and services.',
    sourceFramework: 'express',
    recommendedTargets: ['hono', 'fastify', 'nestjs'],
  },
];

export class ArchetypesController {
  public listArchetypes(_req: Request, res: Response): void {
    res.json({ archetypes: ARCHETYPES });
  }

  public getArchetypeById(req: Request, res: Response): void {
    const id = String(req.params.id || '');
    const archetype = ARCHETYPES.find((a) => a.id === id);
    if (!archetype) {
      res.status(404).json({ error: 'Archetype not found' });
      return;
    }
    res.json(archetype);
  }

  public getStaticArchetype(id: string): ArchetypeInfo | undefined {
    return ARCHETYPES.find((a) => a.id === id);
  }
}
