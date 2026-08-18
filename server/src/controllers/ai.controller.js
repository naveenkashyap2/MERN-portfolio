const { asyncHandler } = require('../utils/asyncHandler');
const { ok } = require('../utils/ApiResponse');
const ai = require('../services/ai.service');
const assistant = require('../services/assistant.service');

module.exports = {
  generate: asyncHandler(async (req, res) => ok(res, await ai.generate(req), 'Planning your journey...')),
  regenerate: asyncHandler(async (req, res) => ok(res, await ai.regenerate(req))),
  optimize: asyncHandler(async (req, res) => ok(res, await ai.optimize(req), 'AI is optimizing your route.')),
  replan: asyncHandler(async (req, res) => ok(res, await ai.replan(req))),
  budget: asyncHandler(async (req, res) => ok(res, await ai.budgetOptimize(req))),
  route: asyncHandler(async (req, res) => ok(res, await ai.routeOptimize(req))),
  suggest: asyncHandler(async (req, res) => ok(res, await ai.suggest(req))),
  chat: asyncHandler(async (req, res) => ok(res, await assistant.chat(req))),
  convos: asyncHandler(async (req, res) => ok(res, await assistant.listConversations(req))),
  getConvo: asyncHandler(async (req, res) => ok(res, await assistant.getConversation(req))),
  createConvo: asyncHandler(async (req, res) => ok(res, await assistant.createConversation(req))),
  deleteConvo: asyncHandler(async (req, res) => ok(res, await assistant.deleteConversation(req))),
  assistantReplan: asyncHandler(async (req, res) => ok(res, await assistant.assistantReplan(req))),
};
