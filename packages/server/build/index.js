require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "34d3a6581d591df48035";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "index";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/webpack/hot/log-apply-result.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__("../../node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "../../node_modules/webpack/hot/log.js":
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "../../node_modules/webpack/hot/signal.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var log = __webpack_require__("../../node_modules/webpack/hot/log.js");
	var checkForUpdate = function checkForUpdate(fromUpdate) {
		module.hot
			.check()
			.then(function(updatedModules) {
				if (!updatedModules) {
					if (fromUpdate) log("info", "[HMR] Update applied.");
					else log("warning", "[HMR] Cannot find update.");
					return;
				}

				return module.hot
					.apply({
						ignoreUnaccepted: true,
						onUnaccepted: function(data) {
							log(
								"warning",
								"Ignored an update to unaccepted module " +
									data.chain.join(" -> ")
							);
						}
					})
					.then(function(renewedModules) {
						__webpack_require__("../../node_modules/webpack/hot/log-apply-result.js")(updatedModules, renewedModules);

						checkForUpdate(true);
						return null;
					});
			})
			.catch(function(err) {
				var status = module.hot.status();
				if (["abort", "fail"].indexOf(status) >= 0) {
					log("warning", "[HMR] Cannot apply update.");
					log("warning", "[HMR] " + (err.stack || err.message));
					log("warning", "[HMR] You need to restart the application!");
				} else {
					log("warning", "[HMR] Update failed: " + (err.stack || err.message));
				}
			});
	};

	process.on( false || "SIGUSR2", function() {
		if (module.hot.status() !== "idle") {
			log(
				"warning",
				"[HMR] Got signal but currently in " + module.hot.status() + " state."
			);
			log("warning", "[HMR] Need to be in idle state to start hot update.");
			return;
		}

		checkForUpdate();
	});
} else {}


/***/ }),

/***/ "./src/aws/s3ImageUploader.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "S3ImageUploader", function() { return S3ImageUploader; });
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("aws-sdk");
/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var s3 = new aws_sdk__WEBPACK_IMPORTED_MODULE_0___default.a.S3();
var S3ImageUploader = (function () {
    function S3ImageUploader(prefix) {
        this.prefix = prefix;
    }
    S3ImageUploader.prototype.upload = function (fileUrl, fileName, bucketRoot) {
        if (bucketRoot === void 0) { bucketRoot = 'assets'; }
        return __awaiter(this, void 0, Promise, function () {
            var fileContent, Key, params, uploadPromise, sendData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileContent = fs__WEBPACK_IMPORTED_MODULE_1___default.a.readFileSync(fileUrl);
                        Key = "images/" + this.prefix + "/" + fileName;
                        params = {
                            Bucket: process.env.AWS_S3_BUCKET,
                            Key: bucketRoot + "/" + Key,
                            Body: fileContent
                        };
                        uploadPromise = new Promise(function (resolve, reject) {
                            s3.upload(params, function (err, data) {
                                if (err) {
                                    reject(err);
                                    throw new Error("upload error " + err.message);
                                }
                                else {
                                    resolve(data);
                                }
                            });
                        });
                        return [4, uploadPromise];
                    case 1:
                        sendData = _a.sent();
                        if (sendData.Location) {
                            return [2, process.env.AWS_CLOUDFRONT_ASSET_URL + "/" + Key];
                        }
                        return [2];
                }
            });
        });
    };
    S3ImageUploader.prototype.download = function (fileName, bucketRoot) {
        if (bucketRoot === void 0) { bucketRoot = 'assets'; }
        var Key = "images/" + this.prefix + "/" + fileName;
        var options = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: bucketRoot + "/" + Key
        };
        return s3.getObject(options).createReadStream();
    };
    S3ImageUploader.prototype.remove = function (imageUuid, bucketRoot) {
        if (bucketRoot === void 0) { bucketRoot = 'assets'; }
        return __awaiter(this, void 0, Promise, function () {
            var listParams, listedObjects, deleteParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listParams = {
                            Bucket: process.env.AWS_S3_BUCKET,
                            Prefix: bucketRoot + "/images/" + this.prefix + "/" + imageUuid
                        };
                        return [4, s3.listObjectsV2(listParams).promise()];
                    case 1:
                        listedObjects = _a.sent();
                        if (listedObjects.Contents.length === 0) {
                            return [2];
                        }
                        deleteParams = {
                            Bucket: process.env.AWS_S3_BUCKET,
                            Delete: { Objects: [] }
                        };
                        listedObjects.Contents.forEach(function (_a) {
                            var Key = _a.Key;
                            deleteParams.Delete.Objects.push({ Key: Key });
                        });
                        return [4, s3.deleteObjects(deleteParams).promise()];
                    case 2:
                        _a.sent();
                        if (!listedObjects.IsTruncated) return [3, 4];
                        return [4, this.remove(imageUuid)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    return S3ImageUploader;
}());



/***/ }),

/***/ "./src/common/whitelistedQuery.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WHITELISTED_QUERIES", function() { return WHITELISTED_QUERIES; });
var WHITELISTED_QUERIES = [
    'login',
    'createUser',
    'IntrospectionQuery'
];


/***/ }),

/***/ "./src/db/comment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommentModel", function() { return CommentModel; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


var CommentSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"]({
    comment: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.String, required: true },
    author: {
        type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.ObjectId,
        ref: 'Post'
    },
    likes: [
        {
            type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.ObjectId,
            ref: 'User',
            default: function () {
                return [];
            }
        }
    ],
    isDeleted: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.Boolean }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
var CommentModel = mongoose__WEBPACK_IMPORTED_MODULE_0__["model"]('Comment', CommentSchema);


/***/ }),

/***/ "./src/db/mongoose.client.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function (_a) {
    var db = _a.db;
    var connect = function () {
        mongoose__WEBPACK_IMPORTED_MODULE_0___default.a
            .connect(db)
            .then(function () {
            return console.info("Successfully connected to " + db);
        })
            .catch(function (error) {
            console.error('Error connecting to database: ', error);
        });
    };
    connect();
    mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.connection.on('disconnected', connect);
});


/***/ }),

/***/ "./src/db/post.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostModel", function() { return PostModel; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


var PostSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"]({
    description: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.String, required: true },
    imageUrl: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.String, required: true },
    likes: [
        {
            type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.ObjectId,
            ref: 'User',
            default: function () {
                return [];
            }
        }
    ],
    author: {
        type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.ObjectId,
            ref: 'Comment',
            default: function () {
                return [];
            }
        }
    ],
    isDeleted: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.Boolean }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
var PostModel = mongoose__WEBPACK_IMPORTED_MODULE_0__["model"]('Post', PostSchema);


/***/ }),

/***/ "./src/db/user.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserModel", function() { return UserModel; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);


var UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"]({
    name: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.String, required: true },
    email: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.String, required: true },
    password: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.String, required: true },
    isDeleted: { type: mongoose__WEBPACK_IMPORTED_MODULE_0__["Schema"].Types.Boolean }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
var UserModel = mongoose__WEBPACK_IMPORTED_MODULE_0__["model"]('User', UserSchema);


/***/ }),

/***/ "./src/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/server.ts");

try {
    var PORT_1 = 8080;
    var server_1;
    if (true) {
        module.hot.accept();
        module.hot.dispose(function (data) {
            if (server_1) {
                server_1.close();
            }
            data.hotReloaded = true;
        });
        module.hot.addStatusHandler(function (status) {
            if (status === 'fail') {
                process.exit(250);
            }
        });
    }
    var firstStartInDevMode_1 =  true && process.env.LAST_EXIT_CODE === '0' && (!module.hot.data || !module.hot.data.hotReloaded);
    Object(_server__WEBPACK_IMPORTED_MODULE_0__["default"])(PORT_1).then(function (serverInstance) {
        if ( false || firstStartInDevMode_1) {
            console.log("GraphQL Server is now running on http://localhost:" + PORT_1);
        }
        server_1 = serverInstance;
    });
}
catch (e) {
    console.error(e);
    process.exit(1);
}


/***/ }),

/***/ "./src/resolvers.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var graphql_upload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("graphql-upload");
/* harmony import */ var graphql_upload__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql_upload__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _resolvers_mutations_post_mutation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/resolvers/mutations/post.mutation.ts");
/* harmony import */ var _resolvers_mutations_user_mutation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/resolvers/mutations/user.mutation.ts");
/* harmony import */ var _resolvers_queries_post_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/resolvers/queries/post.query.ts");
/* harmony import */ var _resolvers_queries_user_query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/resolvers/queries/user.query.ts");
/* harmony import */ var _resolvers_typeDefinitions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./src/resolvers/typeDefinitions/index.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};






/* harmony default export */ __webpack_exports__["default"] = (__assign({ Query: __assign({}, _resolvers_queries_user_query__WEBPACK_IMPORTED_MODULE_4__["userQueries"], _resolvers_queries_post_query__WEBPACK_IMPORTED_MODULE_3__["postQueries"]), Mutation: __assign({}, _resolvers_mutations_user_mutation__WEBPACK_IMPORTED_MODULE_2__["userMutations"], _resolvers_mutations_post_mutation__WEBPACK_IMPORTED_MODULE_1__["postMutations"]), Upload: graphql_upload__WEBPACK_IMPORTED_MODULE_0__["GraphQLUpload"] }, _resolvers_typeDefinitions__WEBPACK_IMPORTED_MODULE_5__["default"]));


/***/ }),

/***/ "./src/resolvers/mutations/post.mutation.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postMutations", function() { return postMutations; });
/* harmony import */ var _db_post__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/db/post.ts");
/* harmony import */ var _services_post_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/services/post.service.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var postMutations = {
    createPost: function (obj, _a, _b) {
        var postData = _a.postData, image = _a.image;
        var currentUser = _b.currentUser;
        return __awaiter(this, void 0, void 0, function () {
            var _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _d = (_c = _services_post_service__WEBPACK_IMPORTED_MODULE_1__["postService"]).createPost;
                        _e = [postData];
                        return [4, image];
                    case 1: return [2, _d.apply(_c, _e.concat([_f.sent(), currentUser.id]))];
                }
            });
        });
    },
    deletePost: function (_, _a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, _db_post__WEBPACK_IMPORTED_MODULE_0__["PostModel"].findOneAndUpdate({
                            _id: id,
                            isDeleted: false
                        }, {
                            $set: {
                                isDeleted: true
                            }
                        })];
                    case 1:
                        _b.sent();
                        return [2, true];
                }
            });
        });
    },
    commentPost: function (obj, _a, _b) {
        var postId = _a.postId, text = _a.text;
        var currentUser = _b.currentUser;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, _services_post_service__WEBPACK_IMPORTED_MODULE_1__["postService"].commentPost(postId, text, currentUser.id)];
                    case 1:
                        _c.sent();
                        return [2, true];
                }
            });
        });
    },
    commentPostImmidiateUpdate: function (obj, _a, _b) {
        var postId = _a.postId, text = _a.text;
        var currentUser = _b.currentUser;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, _services_post_service__WEBPACK_IMPORTED_MODULE_1__["postService"].commentPost(postId, text, currentUser.id)];
                    case 1:
                        _c.sent();
                        return [2, _services_post_service__WEBPACK_IMPORTED_MODULE_1__["postService"].findPost(postId)];
                }
            });
        });
    },
    likePost: function (_, _a, _b) {
        var postId = _a.postId, isLiked = _a.isLiked;
        var currentUser = _b.currentUser;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, _services_post_service__WEBPACK_IMPORTED_MODULE_1__["postService"].likePost(postId, currentUser.id, isLiked)];
                    case 1:
                        _c.sent();
                        return [2];
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/resolvers/mutations/user.mutation.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "authTokenGenerate", function() { return authTokenGenerate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userMutations", function() { return userMutations; });
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _db_user__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/db/user.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/services/user.service.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





function authTokenGenerate(user) {
    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__["sign"]({ userId: user._id }, process.env.APP_SECRET, {
        expiresIn: '1d'
    });
}
var userMutations = {
    createUser: function (obj, _a) {
        var userData = _a.userData;
        return _services_user_service__WEBPACK_IMPORTED_MODULE_4__["userService"].createUser(userData);
    },
    login: function (parent, _a, _b) {
        var email = _a.email, password = _a.password;
        var redis = _b.redis;
        return __awaiter(this, void 0, void 0, function () {
            var user, valid, token;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, _db_user__WEBPACK_IMPORTED_MODULE_3__["UserModel"].findOne({ email: email })];
                    case 1:
                        user = _c.sent();
                        if (!user || user.isDeleted) {
                            throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_0__["ApolloError"]("No such user found for email: ".concat(email), '404');
                        }
                        return [4, bcryptjs__WEBPACK_IMPORTED_MODULE_1__["compareSync"](password, user.password)];
                    case 2:
                        valid = _c.sent();
                        if (!valid) {
                            throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_0__["ApolloError"]('Unauthorized', '401');
                        }
                        token = authTokenGenerate(user);
                        return [4, redis.set(token, JSON.stringify({ id: user._id }), 'ex', 86400)];
                    case 3:
                        _c.sent();
                        return [2, { token: token }];
                }
            });
        });
    }
};


/***/ }),

/***/ "./src/resolvers/queries/post.query.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postQueries", function() { return postQueries; });
/* harmony import */ var _services_post_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/services/post.service.ts");

var postQueries = {
    posts: function () {
        return _services_post_service__WEBPACK_IMPORTED_MODULE_0__["postService"].findPosts();
    },
    post: function (parent, _a) {
        var postId = _a.postId;
        return _services_post_service__WEBPACK_IMPORTED_MODULE_0__["postService"].findPost(postId);
    }
};


/***/ }),

/***/ "./src/resolvers/queries/user.query.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthError", function() { return AuthError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userQueries", function() { return userQueries; });
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/services/user.service.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var AuthError = (function (_super) {
    __extends(AuthError, _super);
    function AuthError() {
        return _super.call(this, 'Not authorized') || this;
    }
    return AuthError;
}(Error));

var userQueries = {
    users: function () {
        return _services_user_service__WEBPACK_IMPORTED_MODULE_0__["userService"].findUsers();
    },
    user: function (parent, _a) {
        var id = _a.id;
        return _services_user_service__WEBPACK_IMPORTED_MODULE_0__["userService"].findUser(id);
    },
    getUserInfo: function (parent, args, context) {
        try {
            return _services_user_service__WEBPACK_IMPORTED_MODULE_0__["userService"].findUser(context.currentUser.id);
        }
        catch (e) {
            throw new AuthError();
        }
    }
};


/***/ }),

/***/ "./src/resolvers/typeDefinitions/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _post__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/resolvers/typeDefinitions/post.ts");

/* harmony default export */ __webpack_exports__["default"] = ({
    Post: _post__WEBPACK_IMPORTED_MODULE_0__["PostResolvers"]
});


/***/ }),

/***/ "./src/resolvers/typeDefinitions/post.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostResolvers", function() { return PostResolvers; });
/* harmony import */ var _services_post_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/services/post.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/services/user.service.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var PostResolvers = {
    lazyComments: function (parent) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _services_post_service__WEBPACK_IMPORTED_MODULE_0__["postService"].getComments(parent.id)];
                    case 1: return [2, (_a.sent()) || []];
                }
            });
        });
    },
    author: function (parent) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2, _services_user_service__WEBPACK_IMPORTED_MODULE_1__["userService"].findUser(parent.author)];
            });
        });
    },
    isLiked: function (parent, args, _a) {
        var currentUser = _a.currentUser;
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_b) {
                return [2, _services_post_service__WEBPACK_IMPORTED_MODULE_0__["postService"].isLiked(parent.id, currentUser.id)];
            });
        });
    }
};


/***/ }),

/***/ "./src/schema.graphql":
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ScalarTypeDefinition","name":{"kind":"Name","value":"Upload"},"directives":[]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Auth"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"token"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"UserInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Comment"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"comment"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"author"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Post"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"description"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"imageUrl"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"author"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"isLiked"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lazyComments"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}},"directives":[]}]},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"PostInput"},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"description"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"users"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"getUserInfo"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"posts"},"arguments":[],"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userData"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Auth"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postData"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PostInput"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"image"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"likePost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"isLiked"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"commentPost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"text"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"commentPostImmidiateUpdate"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"text"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"commentId"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"directives":[]}]}],"loc":{"start":0,"end":954}};
    doc.loc.source = {"body":"scalar Upload\n\ntype User {\n  id: String\n  email: String\n  name: String\n}\n\ntype Auth {\n  token: String\n}\n\ninput UserInput {\n  name: String!\n  email: String!\n  password: String!\n}\n\ntype Comment {\n  id: String\n  comment: String\n  author: User\n}\n\ntype Post {\n  id: String\n  description: String\n  imageUrl: String\n  author: User\n  isLiked: Boolean\n  lazyComments: [Comment]\n}\n\ninput PostInput {\n  description: String!\n}\n\ntype Query {\n  users: [User]\n  user(id: String): User\n  getUserInfo: User\n\n  posts: [Post]\n  post(postId: String): Post\n}\n\ntype Mutation {\n  createUser(userData: UserInput): User\n  login(email: String!, password: String!): Auth\n\n  createPost(postData: PostInput, image: Upload!): Post\n  deletePost(id: String): Boolean\n  likePost(postId: String, isLiked: Boolean): Boolean\n  commentPost(postId: String, text: String): Boolean\n  commentPostImmidiateUpdate(postId: String, text: String): Post\n  deleteComment(commentId: String): Boolean\n}\n\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ "./src/schema.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var graphql_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("graphql-tools");
/* harmony import */ var graphql_tools__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(graphql_tools__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _resolvers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/resolvers.ts");
/* harmony import */ var _schema_graphql__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/schema.graphql");
/* harmony import */ var _schema_graphql__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_schema_graphql__WEBPACK_IMPORTED_MODULE_2__);



var executableSchema = Object(graphql_tools__WEBPACK_IMPORTED_MODULE_0__["makeExecutableSchema"])({
    typeDefs: _schema_graphql__WEBPACK_IMPORTED_MODULE_2__,
    resolvers: _resolvers__WEBPACK_IMPORTED_MODULE_1__["default"]
});
/* harmony default export */ __webpack_exports__["default"] = (executableSchema);


/***/ }),

/***/ "./src/server.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "redis", function() { return redis; });
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("cors");
/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("graphql");
/* harmony import */ var graphql__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(graphql__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var graphql_upload__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("graphql-upload");
/* harmony import */ var graphql_upload__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(graphql_upload__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__("http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ioredis__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__("ioredis");
/* harmony import */ var ioredis__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ioredis__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__("subscriptions-transport-ws");
/* harmony import */ var subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _common_whitelistedQuery__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__("./src/common/whitelistedQuery.ts");
/* harmony import */ var _db_mongoose_client__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__("./src/db/mongoose.client.ts");
/* harmony import */ var _schema__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__("./src/schema.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};












Object(dotenv__WEBPACK_IMPORTED_MODULE_2__["config"])();
function tradeTokenForUser(token) {
    return __awaiter(this, void 0, void 0, function () {
        var userObj, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4, redis.get(token)];
                case 1:
                    userObj = _b.apply(_a, [_c.sent()]);
                    return [2, userObj ? userObj : null];
            }
        });
    });
}
var redis = new ioredis__WEBPACK_IMPORTED_MODULE_7___default.a({ host: process.env.REDIS_HOST });
/* harmony default export */ __webpack_exports__["default"] = (function (port) { return __awaiter(void 0, void 0, Promise, function () {
    var app, server, apolloServer, db;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app = express__WEBPACK_IMPORTED_MODULE_3__();
                server = Object(http__WEBPACK_IMPORTED_MODULE_6__["createServer"])(app);
                app.use('*', cors__WEBPACK_IMPORTED_MODULE_1__({ origin: 'http://localhost:3000' }));
                apolloServer = new apollo_server_express__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"]({
                    schema: _schema__WEBPACK_IMPORTED_MODULE_11__["default"],
                    introspection: true,
                    context: function (_a) {
                        var req = _a.req;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var authToken, currentUser, e_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (_common_whitelistedQuery__WEBPACK_IMPORTED_MODULE_9__["WHITELISTED_QUERIES"].includes(req.body.operationName)) {
                                            return [2, __assign(__assign({}, req), { redis: redis })];
                                        }
                                        authToken = null;
                                        currentUser = null;
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        authToken = req.headers.authorization || '';
                                        return [4, tradeTokenForUser(authToken)];
                                    case 2:
                                        currentUser = _b.sent();
                                        return [3, 4];
                                    case 3:
                                        e_1 = _b.sent();
                                        console.warn("Unable to authenticate using auth token: ".concat(authToken));
                                        return [3, 4];
                                    case 4:
                                        if (!currentUser) {
                                            throw new apollo_server_express__WEBPACK_IMPORTED_MODULE_0__["AuthenticationError"]('you must be logged in');
                                        }
                                        return [2, __assign(__assign({}, req), { authToken: authToken, currentUser: currentUser, redis: redis })];
                                }
                            });
                        });
                    }
                });
                return [4, apolloServer.start()];
            case 1:
                _a.sent();
                app.use(Object(graphql_upload__WEBPACK_IMPORTED_MODULE_5__["graphqlUploadExpress"])({ maxFileSize: 1000000000, maxFiles: 10 }));
                apolloServer.applyMiddleware({ app: app, path: '/graphql' });
                db = process.env.MONGODB_URI;
                Object(_db_mongoose_client__WEBPACK_IMPORTED_MODULE_10__["default"])({ db: db });
                return [2, new Promise(function (resolve) {
                        server.listen(port, function () {
                            new subscriptions_transport_ws__WEBPACK_IMPORTED_MODULE_8__["SubscriptionServer"]({
                                execute: graphql__WEBPACK_IMPORTED_MODULE_4__["execute"],
                                schema: _schema__WEBPACK_IMPORTED_MODULE_11__["default"],
                                subscribe: graphql__WEBPACK_IMPORTED_MODULE_4__["subscribe"]
                            }, {
                                path: '/subscriptions',
                                server: server
                            });
                            resolve(server);
                        });
                    })];
        }
    });
}); });


/***/ }),

/***/ "./src/services/imageService.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageService", function() { return ImageService; });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var uuidv4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("uuidv4");
/* harmony import */ var uuidv4__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(uuidv4__WEBPACK_IMPORTED_MODULE_2__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ImageService = (function () {
    function ImageService(uploader) {
        this.uploader = uploader;
    }
    ImageService.prototype.getFileUrl = function (newFileName) {
        return os__WEBPACK_IMPORTED_MODULE_1__["tmpdir"]() + "/" + newFileName;
    };
    ImageService.prototype.getFileExtension = function (fileName) {
        return fileName.split('.').pop();
    };
    ImageService.prototype.saveImageFile = function (file) {
        return __awaiter(this, void 0, Promise, function () {
            var imageUuid, newFileName, fileUrl, writeStream, fileStream, pipedStream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        imageUuid = Object(uuidv4__WEBPACK_IMPORTED_MODULE_2__["uuid"])();
                        newFileName = imageUuid + "." + this.getFileExtension(file.filename);
                        fileUrl = this.getFileUrl(newFileName);
                        writeStream = fs__WEBPACK_IMPORTED_MODULE_0__["createWriteStream"](fileUrl);
                        fileStream = file.createReadStream();
                        pipedStream = fileStream.pipe(writeStream);
                        return [4, new Promise(function (resolve, reject) {
                                pipedStream.on('finish', function () {
                                    resolve();
                                });
                                pipedStream.on('error', function (e) {
                                    console.error(e);
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2, [fileUrl, imageUuid, newFileName]];
                }
            });
        });
    };
    return ImageService;
}());



/***/ }),

/***/ "./src/services/photos.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PhotosService", function() { return PhotosService; });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _imageService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/services/imageService.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var PhotosService = (function (_super) {
    __extends(PhotosService, _super);
    function PhotosService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PhotosService.prototype.addImage = function (file) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, fileUrl, newFileName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.saveImageFile(file)];
                    case 1:
                        _a = _b.sent(), fileUrl = _a[0], newFileName = _a[2];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 5]);
                        return [4, this.uploader.upload(fileUrl, newFileName)];
                    case 3: return [2, _b.sent()];
                    case 4:
                        fs__WEBPACK_IMPORTED_MODULE_0__["unlinkSync"](fileUrl);
                        return [7];
                    case 5: return [2];
                }
            });
        });
    };
    PhotosService.prototype.removeImage = function (imageUuid) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.uploader.remove(imageUuid)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return PhotosService;
}(_imageService__WEBPACK_IMPORTED_MODULE_1__["ImageService"]));



/***/ }),

/***/ "./src/services/post.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PostService", function() { return PostService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "postService", function() { return postService; });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _aws_s3ImageUploader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/aws/s3ImageUploader.ts");
/* harmony import */ var _db_comment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./src/db/comment.ts");
/* harmony import */ var _db_post__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./src/db/post.ts");
/* harmony import */ var _photos__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./src/services/photos.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var PostService = (function () {
    function PostService() {
    }
    PostService.prototype.findPost = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2, _db_post__WEBPACK_IMPORTED_MODULE_3__["PostModel"].findById(id)];
            });
        });
    };
    PostService.prototype.findPosts = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2, _db_post__WEBPACK_IMPORTED_MODULE_3__["PostModel"].find({})];
            });
        });
    };
    PostService.prototype.createPost = function (postData, image, user) {
        return __awaiter(this, void 0, Promise, function () {
            var imageUrl, post, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4, new _photos__WEBPACK_IMPORTED_MODULE_4__["PhotosService"](new _aws_s3ImageUploader__WEBPACK_IMPORTED_MODULE_1__["S3ImageUploader"](user)).addImage(image)];
                    case 1:
                        imageUrl = _a.sent();
                        post = __assign(__assign({}, postData), { author: user, imageUrl: imageUrl });
                        return [4, _db_post__WEBPACK_IMPORTED_MODULE_3__["PostModel"].create(post)];
                    case 2: return [2, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2, null];
                    case 4: return [2];
                }
            });
        });
    };
    PostService.prototype.commentPost = function (postId, comment, author) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _db_comment__WEBPACK_IMPORTED_MODULE_2__["CommentModel"].create({
                            comment: comment,
                            post: postId,
                            author: author
                        })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PostService.prototype.getComments = function (postId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2, _db_comment__WEBPACK_IMPORTED_MODULE_2__["CommentModel"].find({ post: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId(postId) }).populate({
                        path: 'author'
                    })];
            });
        });
    };
    PostService.prototype.likePost = function (postId, userId, isLiked) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isLiked) return [3, 2];
                        return [4, _db_post__WEBPACK_IMPORTED_MODULE_3__["PostModel"].findOneAndUpdate({ _id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId(postId) }, { $push: { likes: userId } })];
                    case 1:
                        _a.sent();
                        return [3, 4];
                    case 2: return [4, _db_post__WEBPACK_IMPORTED_MODULE_3__["PostModel"].findOneAndUpdate({ _id: new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Types.ObjectId(postId) }, { $pull: { likes: userId } })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    PostService.prototype.isLiked = function (postId, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _db_post__WEBPACK_IMPORTED_MODULE_3__["PostModel"].findById(postId)
                            .populate('likes')
                            .exec()];
                    case 1:
                        post = _a.sent();
                        return [2, !!post.likes.find(function (user) { return user.id === userId; })];
                }
            });
        });
    };
    return PostService;
}());

var postService = new PostService();


/***/ }),

/***/ "./src/services/user.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "userService", function() { return userService; });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _db_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./src/db/user.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var UserService = (function () {
    function UserService() {
    }
    UserService.prototype.findUser = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2, _db_user__WEBPACK_IMPORTED_MODULE_1__["UserModel"].findById(id)];
            });
        });
    };
    UserService.prototype.findUsers = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2, _db_user__WEBPACK_IMPORTED_MODULE_1__["UserModel"].find({})];
            });
        });
    };
    UserService.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, Promise, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData.password = bcryptjs__WEBPACK_IMPORTED_MODULE_0__["hashSync"](userData.password);
                        return [4, _db_user__WEBPACK_IMPORTED_MODULE_1__["UserModel"].create(userData)];
                    case 1: return [2, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [2, null];
                    case 3: return [2];
                }
            });
        });
    };
    return UserService;
}());

var userService = new UserService();


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("@babel/polyfill");
__webpack_require__("../../node_modules/webpack/hot/signal.js");
module.exports = __webpack_require__("./src/index.ts");


/***/ }),

/***/ "@babel/polyfill":
/***/ (function(module, exports) {

module.exports = require("@babel/polyfill");

/***/ }),

/***/ "apollo-server-express":
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "aws-sdk":
/***/ (function(module, exports) {

module.exports = require("aws-sdk");

/***/ }),

/***/ "bcryptjs":
/***/ (function(module, exports) {

module.exports = require("bcryptjs");

/***/ }),

/***/ "cors":
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "graphql":
/***/ (function(module, exports) {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-tools":
/***/ (function(module, exports) {

module.exports = require("graphql-tools");

/***/ }),

/***/ "graphql-upload":
/***/ (function(module, exports) {

module.exports = require("graphql-upload");

/***/ }),

/***/ "http":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "ioredis":
/***/ (function(module, exports) {

module.exports = require("ioredis");

/***/ }),

/***/ "jsonwebtoken":
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "mongoose":
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "os":
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "subscriptions-transport-ws":
/***/ (function(module, exports) {

module.exports = require("subscriptions-transport-ws");

/***/ }),

/***/ "uuidv4":
/***/ (function(module, exports) {

module.exports = require("uuidv4");

/***/ })

/******/ });
//# sourceMappingURL=index.6284eef00ff0ae7e80ea.js.map