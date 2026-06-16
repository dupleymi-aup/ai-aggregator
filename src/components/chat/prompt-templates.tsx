'use client';

import { PROMPT_TEMPLATES, TEMPLATE_CATEGORIES, fillTemplate, extractTemplateVariables } from '@/lib/prompt-templates';
import { X, Search, Wand2, Variable } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '@/lib/chat-store';

export function PromptTemplates() {
  const { setInputText, setShowTemplates } = useChatStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PROMPT_TEMPLATES[0] | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});

  const filteredTemplates = PROMPT_TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (template: typeof PROMPT_TEMPLATES[0]) => {
    const templateVars = extractTemplateVariables(template.content);
    if (templateVars.length > 0) {
      setSelectedTemplate(template);
      setVariables({});
    } else {
      setInputText(template.content);
      setShowTemplates(false);
    }
  };

  const handleFillTemplate = () => {
    if (selectedTemplate) {
      const filled = fillTemplate(selectedTemplate.content, variables);
      setInputText(filled);
      setShowTemplates(false);
      setSelectedTemplate(null);
      setVariables({});
    }
  };

  if (selectedTemplate) {
    const templateVars = extractTemplateVariables(selectedTemplate.content);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Variable className="h-5 w-5 text-amber-500" />
              {selectedTemplate.title}
            </h2>
            <button
              onClick={() => { setSelectedTemplate(null); setVariables({}); }}
              className="rounded-lg p-1.5 hover:bg-accent transition-colors"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
            
            {templateVars.map((varName) => (
              <div key={varName}>
                <label className="block text-sm font-medium mb-1" htmlFor={`var-${varName}`}>
                  {varName}
                </label>
                <input
                  id={`var-${varName}`}
                  type="text"
                  value={variables[varName] || ''}
                  onChange={(e) => setVariables(prev => ({ ...prev, [varName]: e.target.value }))}
                  placeholder={`Введите ${varName}...`}
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            ))}
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleFillTemplate}
                disabled={templateVars.some(v => !variables[v])}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Применить
              </button>
              <button
                onClick={() => { setSelectedTemplate(null); setVariables({}); }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[80vh] rounded-xl border border-border bg-background shadow-2xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-amber-500" />
            Библиотека промптов
          </h2>
          <button
            onClick={() => setShowTemplates(false)}
            className="rounded-lg p-1.5 hover:bg-accent transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск шаблонов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 pl-10 pr-4 py-2 text-sm outline-none focus:border-primary/50 transition-colors"
              aria-label="Поиск шаблонов"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1 px-4 pb-2 overflow-x-auto" role="tablist" aria-label="Категории шаблонов">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              role="tab"
              aria-selected={selectedCategory === cat.id}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent text-muted-foreground'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Templates */}
        <div className="overflow-y-auto max-h-[50vh] p-4 pt-2 space-y-2" role="list">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Шаблоны не найдены
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className="w-full text-left rounded-lg border border-border p-4 hover:bg-accent/50 hover:border-primary/30 transition-all group"
                role="listitem"
                aria-label={`${template.title}: ${template.description}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {TEMPLATE_CATEGORIES.find((c) => c.id === template.category)?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {template.variables && template.variables.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/70">
                      <Variable className="h-3 w-3" />
                      {template.variables.length} {template.variables.length === 1 ? 'переменная' : template.variables.length < 5 ? 'переменные' : 'переменных'}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground/70 line-clamp-1 font-mono">
                    {template.content.substring(0, 100)}...
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
